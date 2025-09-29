const router = require('express').Router();
const { auth } = require('../middleware/auth');
const InspectionSchedule = require('../models/InspectionSchedule');
const Complaint = require('../models/Complaint');

router.get('/suggest', auth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const [areas, projects, inspectors, tickets] = await Promise.all([
      InspectionSchedule.find({ area: re }).distinct('area'),
      InspectionSchedule.find({ project: re }).distinct('project'),
      InspectionSchedule.find({ inspector: re }).distinct('inspector'),
      Complaint.find({ ticket: re }).limit(5).select('ticket -_id')
    ]);

    res.json({
      areas: areas.slice(0, 5),
      projects: projects.slice(0, 5),
      inspectors: inspectors.slice(0, 5),
      tickets: tickets.map(t => t.ticket)
    });
  } catch (e) { next(e); }
});

module.exports = router;
