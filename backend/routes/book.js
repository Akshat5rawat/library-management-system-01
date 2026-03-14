const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', protect, async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const books = await Book.find(filter);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:id', protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book/Movie not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!book) return res.status(404).json({ message: 'Book/Movie not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book/Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
