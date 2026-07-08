/*const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;*/
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
//const protect = require('../middleware/authMiddleware');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login', login);

// Protected route — only accessible with a valid token
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;