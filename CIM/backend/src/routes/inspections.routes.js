const router = require('express').Router();

// SAFE import
const _auth = require('../middleware/auth');
const auth = _auth.auth || _auth;
const requireRole = _auth.requireRole;

const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');

const esc = s => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * GET /api/inspections/schedules?q=
 */
router.get('/schedules', auth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? {
          $or: [
            { project:   { $regex: esc(q), $options: 'i' } },
            { area:      { $regex: esc(q), $options: 'i' } },
            { inspector: { $regex: esc(q), $options: 'i' } }
          ]
        }
      : {};

    const schedules = await InspectionSchedule.find(filter).sort({ dueAt: -1 }).lean();

    const ids = schedules.map(s => s._id);
    const results = await InspectionResult.find({ scheduleId: { $in: ids } }).lean();
    const bySchedule = new Map(results.map(r => [String(r.scheduleId), r]));

    res.json(schedules.map(s => ({ ...s, result: bySchedule.get(String(s._id)) || null })));
  } catch (e) { next(e); }
});

/**
 * POST /api/inspections/schedules
 * - createdBy is required by your schema → set from req.user
 * - do NOT send status; let schema default handle it (avoids enum mismatch)
 */
router.post('/schedules', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { project, area, inspector, dueAt, notes } = req.body || {};
    if (!area || !inspector || !dueAt)
      return res.status(400).json({ error: 'area, inspector and dueAt are required' });

    const payload = {
      project: project || '',
      area,
      inspector,
      // ensure a Date, your schema likely expects Date
      dueAt: new Date(dueAt),
      notes: notes || '',
      // satisfy "createdBy is required"
      ...(req.user?._id ? { createdBy: req.user._id } : {})
      // NO status here → schema default will be used
    };

    const doc = await InspectionSchedule.create(payload);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

/**
 * POST /api/inspections/schedules/:id/result
 * - upsert result
 * - set status only if enum includes a matching value
 */
router.post('/schedules/:id/result', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { outcome, score } = req.body || {};
    if (!['PASS', 'FAIL'].includes(outcome || ''))
      return res.status(400).json({ error: 'outcome must be PASS or FAIL' });

    const sched = await InspectionSchedule.findById(id);
    if (!sched) return res.status(404).json({ error: 'Schedule not found' });

    const result = await InspectionResult.findOneAndUpdate(
      { scheduleId: sched._id },
      { $set: { scheduleId: sched._id, outcome, score } },
      { upsert: true, new: true }
    );

    // Set status only if schema enum allows it
    try {
      const enumVals = (InspectionSchedule.schema?.path('status')?.enumValues) || [];
      if (enumVals.includes('COMPLETED'))      sched.status = 'COMPLETED';
      else if (enumVals.includes('DONE'))      sched.status = 'DONE';
      else if (enumVals.includes('Completed')) sched.status = 'Completed';
      // otherwise leave status as-is to avoid validation error
    } catch {}

    // attach result ref if your schema has it; ignore if not
    try { sched.result = result._id; } catch {}
    await sched.save();

    res.json({ ok: true, result });
  } catch (e) { next(e); }
});

/**
 * DELETE /api/inspections/schedules/:id
 */
router.delete('/schedules/:id', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const sched = await InspectionSchedule.findById(req.params.id).lean();
    if (!sched) return res.status(404).json({ error: 'Not found' });

    const r = await InspectionResult.findOne({ scheduleId: sched._id }).lean();
    if (!r || r.outcome !== 'PASS')
      return res.status(400).json({ error: 'Only PASSED schedules can be deleted' });

    await InspectionResult.deleteOne({ scheduleId: sched._id });
    await InspectionSchedule.deleteOne({ _id: sched._id });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/**
 * GET /api/inspections/alerts
 */
router.get('/alerts', auth, async (req, res, next) => {
  try {
    const now = new Date();
    const next24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const [total, completed, upcoming, overdue] = await Promise.all([
      InspectionSchedule.countDocuments({}),
      InspectionSchedule.countDocuments({ status: 'COMPLETED' }).catch(() => 0), // tolerate enum differences
      InspectionSchedule.countDocuments({ status: { $ne: 'COMPLETED' }, dueAt: { $gte: now, $lte: next24 } }).catch(() => 0),
      InspectionSchedule.countDocuments({ status: { $ne: 'COMPLETED' }, dueAt: { $lt: now } }).catch(() => 0),
    ]);
    res.json({ total, upcoming, overdue, completed });
  } catch (e) { next(e); }
});

module.exports = router;
