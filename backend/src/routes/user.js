const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/user/avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const user = await User.findById(userId);
    user.avatar = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
    await user.save();

    res.json({ avatarUrl: `/api/user/avatar/${userId}` });
  } catch (err) {
    res.status(500).json({ msg: "Avatar upload failed" });
  }
});

// GET /api/user/avatar/:userId
router.get('/avatar/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user && user.avatar && user.avatar.data) {
    res.set('Content-Type', user.avatar.contentType);
    return res.send(user.avatar.data);
  }
  res.status(404).send("No avatar");
});

// GET /api/user/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.avatarUrl = user.avatar && user.avatar.data
      ? `/api/user/avatar/${user._id}`
      : null;

    user.interests = Array.isArray(user.interests) ? user.interests : [];
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Unable to fetch profile" });
  }
});

// PUT /api/user/me
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, interests } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (interests) {
      if (Array.isArray(interests)) {
        user.interests = interests;
      } else if (typeof interests === 'string') {
        user.interests = interests.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    await user.save();

    const userObj = user.toObject();
    userObj.avatarUrl = user.avatar && user.avatar.data
      ? `/api/user/avatar/${user._id}`
      : null;
    userObj.interests = Array.isArray(userObj.interests) ? userObj.interests : [];
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ msg: "Profile update failed" });
  }
});

module.exports = router;