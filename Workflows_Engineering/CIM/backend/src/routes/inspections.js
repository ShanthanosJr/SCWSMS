// ...existing requires
const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');

// (Optional) search schedules by q
router.get('/schedules', auth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const query = q
      ? { $or: [
          { project: new RegExp(q, 'i') },
          { area: new RegExp(q, 'i') },
          { inspector: new RegExp(q, 'i') }
        ] }
      : {};
    const list = await InspectionSchedule.find(query).populate('result').sort({ dueAt: -1 }).lean();
    res.json(list);
  } catch (e) { next(e); }
});

// DELETE schedule — only if PASSED (per requirement)
router.delete('/schedules/:id', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const s = await InspectionSchedule.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ error: 'Not found' });
    const r = await InspectionResult.findOne({ scheduleId: s._id }).lean();
    if (!r || r.outcome !== 'PASS')
      return res.status(400).json({ error: 'Only PASSED schedules can be deleted' });
    await InspectionResult.deleteOne({ scheduleId: s._id });
    await InspectionSchedule.deleteOne({ _id: s._id });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
