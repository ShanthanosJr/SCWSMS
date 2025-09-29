const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');
const dayjs = require('dayjs');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

async function listSchedules(req,res){
  const { status, area, inspector, from, to } = req.query;
  const q = {};
  if (status) q.status = status;
  if (area) q.area = area;
  if (inspector) q.inspector = inspector;
  if (from || to) q.dueAt = Object.assign({}, from?{ $gte: new Date(from) }:{}, to?{ $lte: new Date(to) }:{});
  const list = await InspectionSchedule.find(q).sort({ dueAt: -1 }).lean();
  const results = await InspectionResult.find({ scheduleId: { $in: list.map(s=>s._id) } }).lean();
  const map = {}; results.forEach(r=>map[r.scheduleId]=r);
  res.json(list.map(s => ({ ...s, result: map[s._id] || null })));
}

async function createSchedule(req,res){
  const { area, project, inspector, dueAt, notes } = req.body;
  if (!area || !inspector || !dueAt) return res.status(400).json({ error: 'area, inspector, dueAt required'});
  const s = await InspectionSchedule.create({ area, project: project||'', inspector, dueAt, notes, createdBy: req.user?.name || 'Admin'});
  res.json(s);
}

async function updateSchedule(req,res){
  const s = await InspectionSchedule.findById(req.params.id);
  if(!s) return res.status(404).json({ error: 'Not found' });
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
}

async function postResult(req,res){
  const { id } = req.params;
  const { outcome, score, notes } = req.body;
  const schedule = await InspectionSchedule.findById(id);
  if(!schedule) return res.status(404).json({ error: 'Schedule not found' });
  const files = (req.files||[]).map(f=>`/uploads/${f.filename}`);
  const upsert = await InspectionResult.findOneAndUpdate(
    { scheduleId: schedule._id },
    { $set: { outcome, score: Number(score|| (outcome==='PASS'?100:60)), notes: notes || '', attachments: files } },
    { upsert: true, new: true }
  );
  schedule.status = 'COMPLETED'; await schedule.save();
  res.json({ schedule, result: upsert });
}

async function alerts(req,res){
  const now = new Date();
  const soon24 = new Date(now.getTime()+24*60*60*1000);
  const total = await InspectionSchedule.countDocuments({});
  const upcoming = await InspectionSchedule.countDocuments({ status:'UPCOMING', dueAt: { $gt: now, $lte: soon24 } });
  const overdue = await InspectionSchedule.countDocuments({ status: 'OVERDUE' });
  const completed = await InspectionSchedule.countDocuments({ status: 'COMPLETED' });
  res.json({ total, upcoming, overdue, completed });
}

async function exportCSV(_req, res){
  const list = await InspectionSchedule.find({}).lean();
  const results = await InspectionResult.find({ scheduleId: { $in: list.map(s=>s._id) } }).lean();
  const map = {}; results.forEach(r=>map[r.scheduleId]=r);
  const rows = list.map(s => ({
    project: s.project, area: s.area, inspector: s.inspector,
    dueAt: dayjs(s.dueAt).format('YYYY-MM-DD HH:mm'), status: s.status,
    outcome: map[s._id]?.outcome || '', score: map[s._id]?.score || '', notes: map[s._id]?.notes || ''
  }));
  const csv = new createCsvWriter({ header: [
    {id:'project',title:'Project'},{id:'area',title:'Area'},{id:'inspector',title:'Inspector'},{id:'dueAt',title:'Due At'},{id:'status',title:'Status'},{id:'outcome',title:'Outcome'},{id:'score',title:'Score'},{id:'notes',title:'Notes'}
  ]}).stringifyRecords(rows);
  res.set('Content-Type','text/csv');
  res.set('Content-Disposition','attachment; filename="inspection_report.csv"');
  res.send(csv);
}

module.exports = { listSchedules, createSchedule, updateSchedule, postResult, alerts, exportCSV };
