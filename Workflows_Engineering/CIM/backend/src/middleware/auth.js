// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

/* real middleware with dev bypass */
function authMiddleware(req, res, next) {
  const DEV_NO_AUTH = (process.env.CIM_DEV_NO_AUTH === 'true') || (process.env.NODE_ENV !== 'production');
  if (DEV_NO_AUTH) {
    // Provide a harmless default user so routes depending on req.user work
    if (!req.user) req.user = { _id: 'dev', name: 'Dev User', role: 'ADMIN' };
    return next();
  }
  try {
    const h = req.headers?.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const secret = process.env.JWT_SECRET || 'secret123';
    const payload = jwt.verify(token, secret); // {_id, name, role}
    req.user = payload;
    next();
  } catch {
    try { return res.status(401).json({ error: 'Unauthorized' }); } catch { return; }
  }
}

/* wrapper so both `auth` and `auth()` work */
function auth(...args) {
  if (args.length === 0) return authMiddleware;     // used as auth()
  return authMiddleware(...args);                   // used as auth
}

/* role guard */
function requireRole(role) {
  const mw = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
  return (...args) => (args.length === 0 ? mw : mw(...args));
}

/* exports */
module.exports = auth;            // const auth = require(...)
module.exports.auth = auth;       // const { auth } = require(...)
module.exports.requireRole = requireRole;
