const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDayUtcMs(date) {
    const d = new Date(date);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function daysBetweenUtc(start, end) {
    const diff = startOfDayUtcMs(end) - startOfDayUtcMs(start);
    return Math.floor(diff / MS_PER_DAY);
}

function withFineFields(issueDoc) {
    const endDate = issueDoc.isReturned && issueDoc.returnDate ? issueDoc.returnDate : new Date();
    const daysHeld = Math.max(0, daysBetweenUtc(issueDoc.issueDate, endDate));
    const overdueDays = Math.max(0, daysHeld - 15);
    const fine = overdueDays * 5;

    return {
        ...issueDoc.toObject(),
        daysHeld,
        overdueDays,
        fine
    };
}
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { bookId, userId } = req.body;

        if (!bookId || !userId) {
            return res.status(400).json({ message: 'Please provide both book and member selections' });
        }

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.quantity < 1) {
            return res.status(400).json({ message: 'Book is currently out of stock' });
        }

        const existingIssue = await Issue.findOne({ book: bookId, user: userId, isReturned: false });
        if (existingIssue) {
            return res.status(400).json({ message: 'This member already has this book issued' });
        }

        const issue = new Issue({ book: bookId, user: userId });
        await issue.save();

        book.quantity -= 1;
        if (book.quantity === 0) {
            book.status = 'issued';
        }
        await book.save();

        res.status(201).json({ message: 'Book issued successfully to member', issue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/user/:userId', protect, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const issues = await Issue.find({ user: req.params.userId }).populate('book');
        res.json(issues.map(withFineFields));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/:issueId/return', protect, adminOnly, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.issueId);
        if (!issue) return res.status(404).json({ message: 'Issue record not found' });

        if (issue.isReturned) {
            return res.status(400).json({ message: 'This item is already returned' });
        }

        issue.isReturned = true;
        issue.returnDate = new Date();
        await issue.save();

        const book = await Book.findById(issue.book);
        if (book) {
            book.quantity += 1;
            if (book.quantity > 0) {
                book.status = 'available';
            }
            await book.save();
        }

        const populated = await Issue.findById(issue._id)
            .populate('book')
            .populate('user', 'name username isActive isAdmin');

        res.json({ message: 'Item returned successfully', issue: withFineFields(populated) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const filter = req.query.all === 'true' ? {} : { isReturned: false };
        const issues = await Issue.find(filter)
            .populate('book')
            .populate('user', 'name username isActive isAdmin');

        res.json(issues.map(withFineFields));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
