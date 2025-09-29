// backend/src/routes/analytics.routes.js
const router = require('express').Router();

// SAFE import (works whether middleware exports default or named)
const _auth = require('../middleware/auth');
const auth = _auth.auth || _auth;
const requireRole = _auth.requireRole;

const Complaint = require('../models/Complaint');
const InspectionResult = require('../models/InspectionResult');
const InspectionSchedule = require('../models/InspectionSchedule');
const ComplianceDaily = require('../models/ComplianceDaily');

/**
 * GET /api/analytics/compliance?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns daily compliance trend from ComplianceDaily.
 */
router.get('/compliance', auth, async (req, res, next) => {
  try {
    const { from, to } = req.query || {};
    const q = {};
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to) q.date.$lte = new Date(to);
    }
    const rows = await ComplianceDaily.find(q).sort({ date: 1 }).lean();
    res.json(rows || []);
  } catch (e) { next(e); }
});

/**
 * GET /api/analytics/complaint-stats
 * Returns { byType: [{_id: type, count}], byStatus: [{_id: status, count}] }
 */
router.get('/complaint-stats', auth, async (req, res, next) => {
  try {
    const [byType, byStatus] = await Promise.all([
      Complaint.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    res.json({ byType, byStatus });
  } catch (e) { next(e); }
});

/**
 * GET /api/analytics/recurring
 * Returns failures grouped by area: [{ area, fails }]
 */
router.get('/recurring', auth, async (req, res, next) => {
  try {
    const agg = await InspectionResult.aggregate([
      { $match: { outcome: 'FAIL' } },
      { $lookup: {
          from: 'inspectionschedules',         // collection name for InspectionSchedule
          localField: 'scheduleId',
          foreignField: '_id',
          as: 'sched'
      }},
      { $unwind: '$sched' },
      { $group: { _id: '$sched.area', fails: { $sum: 1 } } },
      { $project: { _id: 0, area: '$_id', fails: 1 } },
      { $sort: { fails: -1, area: 1 } }
    ]);
    res.json(agg || []);
  } catch (e) { next(e); }
});

/**
 * POST /api/analytics/recompute
 * Recomputes ComplianceDaily from InspectionResult + InspectionSchedule.
 * ADMIN-only.
 */
router.post('/recompute', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const agg = await InspectionResult.aggregate([
      { $lookup: {
          from: 'inspectionschedules',
          localField: 'scheduleId',
          foreignField: '_id',
          as: 'sched'
      }},
      { $unwind: '$sched' },
      {
        $group: {
          _id: {
            area: '$sched.area',
            day: { $dateTrunc: { date: '$sched.dueAt', unit: 'day' } }
          },
          completed: { $sum: 1 },
          passed: { $sum: { $cond: [{ $eq: ['$outcome', 'PASS'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          area: '$_id.area',
          date: '$_id.day',
          completed: 1,
          passed: 1,
          score: {
            $multiply: [
              { $divide: ['$passed', { $max: [1, '$completed'] }] },
              100
            ]
          }
        }
      },
      { $sort: { date: 1, area: 1 } }
    ]);

    // Upsert each daily row
    for (const r of agg) {
      await ComplianceDaily.updateOne(
        { area: r.area, date: r.date },
        {
          $set: {
            area: r.area,
            date: r.date,
            completed: r.completed,
            passed: r.passed,
            score: r.score
          }
        },
        { upsert: true }
      );
    }

    res.json({ ok: true, updated: agg.length });
  } catch (e) { next(e); }
});

module.exports = router;
