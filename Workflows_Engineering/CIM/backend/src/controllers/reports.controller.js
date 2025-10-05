const createCsv = require('csv-writer').createObjectCsvStringifier;
const PDFDocument = require('pdfkit');
const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');
const Complaint = require('../models/Complaint');
const dayjs = require('dayjs');

async function gatherInspections(){
  const list = await InspectionSchedule.find({}).lean();
  const results = await InspectionResult.find({ scheduleId: { $in: list.map(s=>s._id) } }).lean();
  const map = {}; results.forEach(r=>map[r.scheduleId]=r);
  return list.map(s => ({
    project: s.project, area: s.area, inspector: s.inspector, dueAt: dayjs(s.dueAt).format('YYYY-MM-DD HH:mm'),
    status: s.status, outcome: map[s._id]?.outcome || '', score: map[s._id]?.score || '', notes: map[s._id]?.notes || ''
  }));
}

async function exportInspectionsCSV(_req,res){
  const rows = await gatherInspections();
  const csv = new createCsv({ header:[
    {id:'project',title:'Project'},{id:'area',title:'Area'},{id:'inspector',title:'Inspector'},{id:'dueAt',title:'Due At'},{id:'status',title:'Status'},{id:'outcome',title:'Outcome'},{id:'score',title:'Score'},{id:'notes',title:'Notes'}
  ]}).stringifyRecords(rows);
  res.set('Content-Type','text/csv'); res.set('Content-Disposition','attachment; filename="inspections.csv"'); res.send(csv);
}

async function exportInspectionsPDF(_req,res){
  const rows = await gatherInspections();
  const doc = new PDFDocument({ size:'A4', margin: 40 });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','attachment; filename="inspections.pdf"');
  doc.fontSize(16).text('Inspection Report', { align:'center' }); doc.moveDown();
  doc.fontSize(10);
  rows.forEach(r=> doc.text(`${r.dueAt} | ${r.area} | ${r.inspector} | ${r.status} | ${r.outcome} (${r.score})`));
  doc.end(); doc.pipe(res);
}

async function exportComplaintsCSV(_req,res){
  const list = await Complaint.find({}).lean();
  const csv = new createCsv({ header:[
    {id:'ticket',title:'Ticket'},{id:'area',title:'Area'},{id:'type',title:'Type'},{id:'status',title:'Status'},{id:'assignee',title:'Assignee'},{id:'description',title:'Description'}
  ]}).stringifyRecords(list.map(c=>({ ticket:c.ticket, area:c.area, type:c.type, status:c.status, assignee:c.assignee, description:c.description })));
  res.set('Content-Type','text/csv'); res.set('Content-Disposition','attachment; filename="complaints.csv"'); res.send(csv);
}

async function exportComplaintsPDF(_req,res){
  const list = await Complaint.find({}).lean();
  const doc = new PDFDocument({ size:'A4', margin: 40 });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','attachment; filename="complaints.pdf"');
  doc.fontSize(16).text('Complaints Report', { align:'center' }); doc.moveDown(); doc.fontSize(10);
  list.forEach(c=> doc.text(`${c.ticket} | ${c.area} | ${c.type} | ${c.status} | ${c.assignee}`));
  doc.end(); doc.pipe(res);
}

module.exports = { exportInspectionsCSV, exportInspectionsPDF, exportComplaintsCSV, exportComplaintsPDF };
