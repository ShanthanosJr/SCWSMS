const router = require('express').Router();

// SAFE import (works whether middleware exports default or named)
const _auth = require('../middleware/auth');
const auth = _auth.auth || _auth;
const requireRole = _auth.requireRole;

const Complaint = require('../models/Complaint');

/** List complaints (optional q: ticket/area/type/complainantName) */
router.get('/', auth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? { $or: [
          { ticket: new RegExp(q, 'i') },
          { area: new RegExp(q, 'i') },
          { type: new RegExp(q, 'i') },
          { complainantName: new RegExp(q, 'i') }
        ] }
      : {};
    const list = await Complaint.find(filter).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) { next(e); }
});

/** Track by ticket */
router.get('/track/:ticket', auth, async (req, res, next) => {
  try {
    const doc = await Complaint.findOne({ ticket: req.params.ticket }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

/** Create (WORKER only) */
router.post('/', auth, requireRole('WORKER'), async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.area || !b.type || !b.complainantName || !b.complainantId || !b.mobile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const doc = await Complaint.create({
      area: b.area,
      type: b.type,
      description: b.description,
      photoUrl: b.photoUrl,
      complainantName: b.complainantName,
      complainantId: b.complainantId,
      mobile: b.mobile,
      createdBy: req.user?._id
    });
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

/** Update (ADMIN only) */
router.put('/:id', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { status, assignee, escalated } = req.body || {};
    const doc = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(status && { status }), ...(assignee && { assignee }), ...(typeof escalated === 'boolean' && { escalated }) } },
      { new: true }
    ).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

module.exports = router;
