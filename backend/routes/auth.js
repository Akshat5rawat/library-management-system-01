const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.isActive)
            return res.status(403).json({ message: 'Account is inactive' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/seed', async (req, res) => {
    try {
        const exists = await User.findOne({ username: 'admin' });
        if (exists) return res.json({ message: 'Admin already exists' });
        const admin = new User({
            name: 'Administrator',
            username: 'admin',
            password: 'admin123',
            isAdmin: true,
            isActive: true,
        });
        await admin.save();
        res.json({ message: 'Admin created: username=admin, password=admin123' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
