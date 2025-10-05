const router = require('express').Router();
const Complaint = require('../models/Complaint');
const { auth, requireRole } = require('../middleware/auth');

// List + search (q can match ticket, area, type, complainantName)
router.get('/', auth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const query = q
      ? {
          $or: [
            { ticket: new RegExp(q, 'i') },
            { area: new RegExp(q, 'i') },
            { type: new RegExp(q, 'i') },
            { complainantName: new RegExp(q, 'i') }
          ]
        }
      : {};
    const list = await Complaint.find(query).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) { next(e); }
});

// Track by ticket
router.get('/track/:ticket', auth, async (req, res, next) => {
  try {
    const doc = await Complaint.findOne({ ticket: req.params.ticket }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

// CREATE — only WORKER can lodge a complaint; Admin cannot (per requirement)
router.post('/', auth, requireRole('WORKER'), async (req, res, next) => {
  try {
    const body = req.body || {};
    const doc = await Complaint.create({
      area: body.area,
      type: body.type,
      description: body.description,
      photoUrl: body.photoUrl,
      complainantName: body.complainantName,
      complainantId: body.complainantId,
      mobile: body.mobile,
      createdBy: req.user._id
    });
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

// UPDATE — Admin manages status/routing
router.put('/:id', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { status, assignee, escalated } = req.body;
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { status, assignee, escalated } },
      { new: true }
    );
    res.json(doc);
  } catch (e) { next(e); }
});

module.exports = router;
