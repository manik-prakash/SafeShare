const { log } = require('../utils/logger');

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      log('RBAC: User not authenticated', 'WARN');
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      log(`RBAC: Access denied for user ${req.user.username} with role ${req.user.role}`, 'WARN');
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};

module.exports = { checkRole };
