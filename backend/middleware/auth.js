const jwt = require('jsonwebtoken');
const User = require('../models/User');
const log = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      log('Authentication failed: No token provided', 'WARN');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      log(`Authentication failed: User not found (ID: ${decoded.userId})`, 'WARN');
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    log(`Authentication error: ${error.message}`, 'ERROR');
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
