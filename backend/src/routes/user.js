const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get user profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user).select('-password');
  res.json(user);
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  const { name, interests } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user,
    { $set: { name, interests } },
    { new: true }
  ).select('-password');
  res.json(updated);
});

module.exports = router;