const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const User = require('../models/User'); // Import User model
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', protect, async (req, res) => {
    try {
        const memberships = await Membership.find({ isRemoved: false });
        res.json(memberships);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:membershipNumber', protect, async (req, res) => {
    try {
        const membership = await Membership.findOne({
            membershipNumber: req.params.membershipNumber,
        });
        if (!membership)
            return res.status(404).json({ message: 'Membership not found' });
        res.json(membership);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const membership = new Membership(req.body);
        await membership.save();

        // Create the corresponding User account automatically
        const user = new User({
            name: `${membership.firstName} ${membership.lastName}`,
            username: membership.membershipNumber,
            password: membership.contactName, // Mobile Number as password
            isAdmin: false
        });
        await user.save();

        res.status(201).json({
            membership,
            account: {
                username: user.username,
                password: membership.contactName // Return raw password to show frontend once
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Aadhar Card Number or Contact Number already exists in the system.' });
        }
        res.status(400).json({ message: err.message });
    }
});
router.put('/:membershipNumber', protect, adminOnly, async (req, res) => {
    try {
        const membership = await Membership.findOneAndUpdate(
            { membershipNumber: req.params.membershipNumber },
            req.body,
            { returnDocument: 'after' }
        );
        if (!membership)
            return res.status(404).json({ message: 'Membership not found' });
        res.json(membership);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/:membershipNumber', protect, adminOnly, async (req, res) => {
    try {
        const membership = await Membership.findOneAndUpdate(
            { membershipNumber: req.params.membershipNumber },
            { isRemoved: true },
            { returnDocument: 'after' }
        );
        if (!membership)
            return res.status(404).json({ message: 'Membership not found' });
        res.json({ message: 'Membership removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
