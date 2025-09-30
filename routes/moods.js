const express = require('express');
const { createMood, getMoodsByUserId } = require('../utils/dataManager');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/moods - Fetch all mood entries for logged-in user
router.get('/', async (req, res) => {
  try {
    const moods = await getMoodsByUserId(req.user.id);
    // Sort by date (newest first)
    const sortedMoods = moods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ moods: sortedMoods });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error while fetching moods' });
  }
});

// POST /api/moods - Add a mood log
router.post('/', async (req, res) => {
  try {
    const { emoji, rating, note, date } = req.body;

    // Validation
    if (!emoji && !rating) {
      return res.status(400).json({ message: 'Either emoji or rating is required' });
    }

    if (rating && (rating < 1 || rating > 10)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }

    const moodData = {
      emoji: emoji || null,
      rating: rating ? Number(rating) : null,
      note: note || '',
      date: date || new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      userId: req.user.id
    };

    const newMood = await createMood(moodData);
    res.status(201).json({ 
      message: 'Mood logged successfully', 
      mood: newMood 
    });
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ message: 'Server error while logging mood' });
  }
});

// GET /api/moods/stats - Get mood statistics
router.get('/stats', async (req, res) => {
  try {
    const moods = await getMoodsByUserId(req.user.id);
    
    // Calculate statistics
    const totalMoods = moods.length;
    const ratingsOnly = moods.filter(mood => mood.rating).map(mood => mood.rating);
    const averageRating = ratingsOnly.length > 0 
      ? ratingsOnly.reduce((sum, rating) => sum + rating, 0) / ratingsOnly.length 
      : 0;

    // Get mood trend for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMoods = moods.filter(mood => 
      new Date(mood.createdAt) >= sevenDaysAgo
    );

    // Group by date
    const moodsByDate = {};
    recentMoods.forEach(mood => {
      const date = mood.date || mood.createdAt.split('T')[0];
      if (!moodsByDate[date]) {
        moodsByDate[date] = [];
      }
      moodsByDate[date].push(mood);
    });

    // Calculate daily averages
    const dailyAverages = Object.entries(moodsByDate).map(([date, dayMoods]) => {
      const dayRatings = dayMoods.filter(mood => mood.rating).map(mood => mood.rating);
      const average = dayRatings.length > 0 
        ? dayRatings.reduce((sum, rating) => sum + rating, 0) / dayRatings.length 
        : 0;
      return { date, average, count: dayMoods.length };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      stats: {
        totalMoods,
        averageRating: Math.round(averageRating * 10) / 10,
        recentMoodsCount: recentMoods.length,
        dailyAverages
      }
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ message: 'Server error while calculating mood statistics' });
  }
});

module.exports = router;
