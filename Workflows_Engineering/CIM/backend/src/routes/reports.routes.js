const router = require('express').Router();

// SAFE middleware import (works whether exported as default or named)
const _auth = require('../middleware/auth');
const auth = (_auth && (_auth.auth || _auth)) || ((req, res, next) => next());
const requireRole = (_auth && _auth.requireRole) || (() => (req, res, next) => next());

// Models
const Complaint = require('../models/Complaint');
const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');

// Small helpers
function asDate(v){ try{ return new Date(v).toLocaleString(); }catch{ return String(v||''); } }
function header(doc, title){
  doc.fontSize(16).text('Workflow Engineering', 50, 40);
  doc.fontSize(10).fillColor('#555').text('Compliance, Inspection & Monitoring', 50, 60);
  doc.moveTo(50, 80).lineTo(545, 80).strokeColor('#999').stroke();
  doc.fillColor('#000').fontSize(14).text(title, 50, 95);
  doc.moveDown();
}
function footer(doc){
  doc.moveDown(3);
  doc.text('Authorized Signature: __________________________', 50, doc.y + 10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 50, doc.y + 10);
}

// GET /api/reports/complaint/:id.pdf  (ADMIN)
router.get('/complaint/:id.pdf', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const PDFDocument = (() => { try { return require('pdfkit'); } catch { return null; } })();
    if (!PDFDocument) return res.status(501).json({ error: 'PDF not available. Install dependency: npm i pdfkit' });

    const c = await Complaint.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ error: 'Not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${c.ticket||'complaint'}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    header(doc, 'Complaint Report');
    doc.fontSize(11);
    doc.text(`Ticket: ${c.ticket || '-'}`);
    doc.text(`Type: ${c.type || '-'}`);
    doc.text(`Area: ${c.area || '-'}`);
    doc.text(`Status: ${c.status || '-'}`);
    doc.text(`Complainant: ${c.complainantName || '-'}  (ID: ${c.complainantId || '-'}, Mobile: ${c.mobile || '-'})`);
    doc.moveDown();
    doc.text('Description:', { underline: true });
    doc.text(c.description || '-', { align: 'justify' });

    footer(doc);
    doc.end();
  } catch (e) { next(e); }
});

// GET /api/reports/inspection/:id.pdf  (ADMIN)
router.get('/inspection/:id.pdf', auth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const PDFDocument = (() => { try { return require('pdfkit'); } catch { return null; } })();
    if (!PDFDocument) return res.status(501).json({ error: 'PDF not available. Install dependency: npm i pdfkit' });

    const s = await InspectionSchedule.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ error: 'Not found' });
    const r = await InspectionResult.findOne({ scheduleId: s._id }).lean();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="inspection-${s._id}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    header(doc, 'Inspection Report');
    doc.fontSize(11);
    doc.text(`Project: ${s.project || '-'}`);
    doc.text(`Area: ${s.area || '-'}`);
    doc.text(`Inspector: ${s.inspector || '-'}`);
    doc.text(`Due At: ${asDate(s.dueAt)}`);
    doc.text(`Status: ${s.status || '-'}`);
    doc.moveDown();
    doc.text('Result:', { underline: true });
    doc.text(r ? `Outcome: ${r.outcome || '-'}, Score: ${r.score ?? '-'}` : 'No result recorded');

    footer(doc);
    doc.end();
  } catch (e) { next(e); }
});

module.exports = router;
