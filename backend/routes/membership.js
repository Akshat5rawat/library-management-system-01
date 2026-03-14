const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
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
        res.status(201).json(membership);
    } catch (err) {
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
