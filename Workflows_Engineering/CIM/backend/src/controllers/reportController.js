const PDFDocument = require('pdfkit');
const Complaint = require('../models/Complaint');
const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');
const path = require('path');
const fs = require('fs');

const company = { name: 'Workflow Engineering', logo: path.join(__dirname, '..', '..', 'assets', 'logo.png') };

function header(doc, title){
  // Letterhead
  if (fs.existsSync(company.logo)) doc.image(company.logo, 50, 40, { width: 60 });
  doc.fontSize(16).text(company.name, 120, 45).fontSize(10).fillColor('#555').text('Compliance, Inspection & Monitoring', 120, 65);
  doc.moveTo(50, 90).lineTo(545, 90).strokeColor('#999').stroke();
  doc.fillColor('#000').fontSize(14).text(title, 50, 105);
  doc.moveDown();
}

function footer(doc){
  doc.moveDown(4);
  doc.text('Authorized Signature: __________________________', 50, doc.y + 20);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 50, doc.y + 10);
}

exports.complaintPdf = async (req, res, next) => {
  try {
    const c = await Complaint.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ error: 'Not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${c.ticket}.pdf"`);
    doc.pipe(res);

    header(doc, 'Complaint Report');

    doc.fontSize(11);
    doc.text(`Ticket: ${c.ticket}`);
    doc.text(`Type: ${c.type}`);
    doc.text(`Area: ${c.area}`);
    doc.text(`Status: ${c.status}`);
    doc.text(`Complainant: ${c.complainantName}  (ID: ${c.complainantId}, Mobile: ${c.mobile})`);
    doc.moveDown();
    doc.text('Description:', { underline: true });
    doc.text(c.description || '-', { align: 'justify' });

    footer(doc);
    doc.end();
  } catch (e) { next(e); }
};

exports.inspectionPdf = async (req, res, next) => {
  try {
    const s = await InspectionSchedule.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ error: 'Not found' });
    const r = await InspectionResult.findOne({ scheduleId: s._id }).lean();

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="INS-${s._id}.pdf"`);
    doc.pipe(res);

    header(doc, 'Inspection Report');

    doc.fontSize(11);
    doc.text(`Project: ${s.project || '-'}`);
    doc.text(`Area: ${s.area}`);
    doc.text(`Inspector: ${s.inspector}`);
    doc.text(`Due At: ${new Date(s.dueAt).toLocaleString()}`);
    doc.text(`Status: ${s.status}`);
    doc.moveDown();
    doc.text('Result:', { underline: true });
    doc.text(r ? `Outcome: ${r.outcome}, Score: ${r.score || '-'}` : 'No result recorded');

    footer(doc);
    doc.end();
  } catch (e) { next(e); }
};
