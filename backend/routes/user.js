const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name, username, password, isActive, isAdmin } = req.body;
        const existing = await User.findOne({ username });
        if (existing)
            return res.status(400).json({ message: 'Username already exists' });
        const user = new User({ name, username, password, isActive, isAdmin });
        await user.save();
        res
            .status(201)
            .json({ id: user._id, name: user.name, username: user.username });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { name, isActive, isAdmin, password } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name ?? user.name;
        user.isActive = isActive ?? user.isActive;
        user.isAdmin = isAdmin ?? user.isAdmin;
        if (password) user.password = password;

        await user.save();
        res.json({ id: user._id, name: user.name, isActive: user.isActive, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
