const router = require('express').Router();

// SAFE import
const _auth = require('../middleware/auth');
const auth = _auth.auth || _auth;
const requireRole = _auth.requireRole;

const r = require('../controllers/reportController');

router.get('/complaint/:id.pdf', auth, requireRole('ADMIN'), r.complaintPdf);
router.get('/inspection/:id.pdf', auth, requireRole('ADMIN'), r.inspectionPdf);

module.exports = router;
