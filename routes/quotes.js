const express = require('express');
const { getAllQuotes, createQuote } = require('../utils/dataManager');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/quotes - Fetch all motivational quotes (public)
router.get('/', async (req, res) => {
  try {
    const quotes = await getAllQuotes();
    // Shuffle quotes for variety
    const shuffledQuotes = quotes.sort(() => Math.random() - 0.5);
    res.json({ quotes: shuffledQuotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ message: 'Server error while fetching quotes' });
  }
});

// GET /api/quotes/random - Get a random quote
router.get('/random', async (req, res) => {
  try {
    const quotes = await getAllQuotes();
    if (quotes.length === 0) {
      return res.status(404).json({ message: 'No quotes available' });
    }
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote });
  } catch (error) {
    console.error('Get random quote error:', error);
    res.status(500).json({ message: 'Server error while fetching random quote' });
  }
});

// POST /api/quotes - Add a motivational quote (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { text, author } = req.body;

    // Validation
    if (!text) {
      return res.status(400).json({ message: 'Quote text is required' });
    }

    if (text.length > 500) {
      return res.status(400).json({ message: 'Quote text must be less than 500 characters' });
    }

    const quoteData = {
      text: text.trim(),
      author: author ? author.trim() : 'Anonymous',
      submittedBy: req.user.id,
      submittedByName: req.user.name
    };

    const newQuote = await createQuote(quoteData);
    res.status(201).json({ 
      message: 'Quote added successfully', 
      quote: newQuote 
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ message: 'Server error while adding quote' });
  }
});

module.exports = router;
