const Complaint = require('../models/Complaint');
const { ticketId } = require('../utils/id');

function autoType(text){
  const t = (text||'').toLowerCase();
  if (t.includes('quality')) return 'QUALITY';
  if (t.includes('delay')) return 'DELAY';
  if (t.includes('injury') || t.includes('unsafe') || t.includes('fire') || t.includes('hazard')) return 'SAFETY';
  return 'OTHER';
}
function routeTo(type){
  if (type==='SAFETY') return 'Safety Officer';
  if (type==='DELAY') return 'Operations Lead';
  if (type==='QUALITY') return 'Quality Lead';
  return 'Manager';
}

async function list(req,res){
  const { status, area, type } = req.query;
  const q = {};
  if (status) q.status = status;
  if (area) q.area = area;
  if (type) q.type = type;
  const data = await Complaint.find(q).sort({ createdAt: -1 });
  res.json(data);
}

async function create(req,res){
  let { area, type, complainant, description, photoUrl } = req.body;
  if (!area || !description) return res.status(400).json({ error: 'area and description required' });
  type = type || autoType(description);
  const ticket = ticketId('CMP');
  const assignee = routeTo(type);
  const c = await Complaint.create({ ticket, area, type, complainant, description, photoUrl, assignee,
    history: [{ at:new Date(), action:'CREATED', note:'Logged via form/chatbot'}]});
  res.json(c);
}

async function getByTicket(req,res){
  const c = await Complaint.findOne({ ticket: req.params.ticket });
  if (!c) return res.status(404).json({ error:'Not found' });
  res.json(c);
}

async function update(req,res){
  const { id } = req.params;
  const c = await Complaint.findById(id);
  if(!c) return res.status(404).json({ error:'Not found' });
  const { status, assignee, note } = req.body;
  if (status) c.status = status;
  if (assignee) c.assignee = assignee;
  if (note) c.history.push({ at:new Date(), action:'UPDATE', note });
  await c.save();
  res.json(c);
}

module.exports = { list, create, getByTicket, update };
