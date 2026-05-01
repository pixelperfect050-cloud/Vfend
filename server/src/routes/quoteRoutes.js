const router = require('express').Router();
const { submitQuote, getAllQuotes, replyToQuote, deleteQuote } = require('../controllers/quoteController');
const { adminAuth } = require('../middleware/auth');

// Public route — no auth required
router.post('/submit', submitQuote);

// Admin routes
router.get('/all', adminAuth, getAllQuotes);
router.put('/:id/reply', adminAuth, replyToQuote);
router.delete('/:id', adminAuth, deleteQuote);

module.exports = router;
