import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Save,
  X,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MoodJournal = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState({
    emoji: '',
    rating: 5,
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const moodEmojis = [
    { emoji: '😢', label: 'Very Sad', value: 1, color: 'from-red-500 to-red-600' },
    { emoji: '😞', label: 'Sad', value: 2, color: 'from-orange-500 to-red-500' },
    { emoji: '😐', label: 'Neutral', value: 3, color: 'from-yellow-500 to-orange-500' },
    { emoji: '🙂', label: 'Good', value: 4, color: 'from-green-400 to-yellow-500' },
    { emoji: '😊', label: 'Happy', value: 5, color: 'from-green-500 to-green-400' },
    { emoji: '😄', label: 'Very Happy', value: 6, color: 'from-blue-400 to-green-500' },
    { emoji: '🤩', label: 'Excited', value: 7, color: 'from-purple-400 to-blue-400' },
    { emoji: '🥰', label: 'Loved', value: 8, color: 'from-pink-400 to-purple-400' },
    { emoji: '😍', label: 'Amazing', value: 9, color: 'from-pink-500 to-pink-400' },
    { emoji: '🤗', label: 'Fantastic', value: 10, color: 'from-yellow-400 to-pink-500' }
  ];

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await axios.get('/api/moods');
      setMoods(response.data.moods);
    } catch (error) {
      console.error('Error fetching moods:', error);
      toast.error('Failed to load mood entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMood = async (e) => {
    e.preventDefault();
    
    if (!selectedMood.emoji && !selectedMood.rating) {
      toast.error('Please select a mood or rating');
      return;
    }

    try {
      const response = await axios.post('/api/moods', selectedMood);
      setMoods(prev => [response.data.mood, ...prev]);
      setSelectedMood({
        emoji: '',
        rating: 5,
        note: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      toast.success('Mood logged successfully! 🎉');
    } catch (error) {
      console.error('Error adding mood:', error);
      toast.error('Failed to log mood');
    }
  };

  const getMoodColor = (rating) => {
    if (rating <= 2) return 'from-red-500 to-red-600';
    if (rating <= 4) return 'from-orange-500 to-yellow-500';
    if (rating <= 6) return 'from-yellow-500 to-green-400';
    if (rating <= 8) return 'from-green-400 to-blue-400';
    return 'from-blue-400 to-purple-500';
  };

  const getMoodIcon = (rating) => {
    if (rating <= 3) return Frown;
    if (rating <= 7) return Meh;
    return Smile;
  };

  const EmojiSelector = ({ selectedEmoji, onSelect }) => (
    <div className="grid grid-cols-5 gap-3">
      {moodEmojis.map((mood, index) => (
        <motion.button
          key={mood.emoji}
          type="button"
          onClick={() => onSelect(mood.emoji, mood.value)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
            selectedEmoji === mood.emoji
              ? `bg-gradient-to-r ${mood.color} shadow-lg scale-110`
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: selectedEmoji === mood.emoji ? 1.1 : 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <motion.span
            animate={{ 
              rotate: selectedEmoji === mood.emoji ? [0, -10, 10, -10, 0] : 0 
            }}
            transition={{ duration: 0.5 }}
          >
            {mood.emoji}
          </motion.span>
        </motion.button>
      ))}
    </div>
  );

  const RatingSlider = ({ rating, onChange }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mood Rating
        </span>
        <motion.span
          className={`px-3 py-1 rounded-full bg-gradient-to-r ${getMoodColor(rating)} text-white font-medium`}
          key={rating}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {rating}/10
        </motion.span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f97316 20%, #eab308 40%, #22c55e 60%, #3b82f6 80%, #8b5cf6 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>😢 Very Sad</span>
          <span>😐 Neutral</span>
          <span>😊 Very Happy</span>
        </div>
      </div>
    </div>
  );

  const MoodCard = ({ mood, index }) => {
    const MoodIcon = getMoodIcon(mood.rating || 5);
    
    return (
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        layout
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {mood.emoji ? (
              <motion.div
                className="text-4xl"
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {mood.emoji}
              </motion.div>
            ) : (
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getMoodColor(mood.rating)} flex items-center justify-center`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <MoodIcon className="w-6 h-6 text-white" />
              </motion.div>
            )}
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(mood.date || mood.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {mood.rating && (
                <motion.div
                  className={`inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r ${getMoodColor(mood.rating)} text-white text-xs font-medium`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  {mood.rating}/10
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {mood.note && (
          <motion.div
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              "{mood.note}"
            </p>
          </motion.div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(mood.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your mood journal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Mood Journal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your emotional well-being and discover patterns
            </p>
          </div>

          <motion.button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Log Mood</span>
          </motion.button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="card p-6 text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {moods.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Entries</p>
          </div>

          <div className="card p-6 text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {moods.filter(m => m.rating).length > 0 
                ? Math.round(moods.filter(m => m.rating).reduce((sum, m) => sum + m.rating, 0) / moods.filter(m => m.rating).length * 10) / 10
                : '0'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>

          <div className="card p-6 text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {moods.filter(m => {
                const today = new Date().toISOString().split('T')[0];
                const moodDate = (m.date || m.createdAt.split('T')[0]);
                return moodDate === today;
              }).length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Today's Entries</p>
          </div>
        </motion.div>

        {/* Mood Entries */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {moods.length > 0 ? (
              moods.map((mood, index) => (
                <MoodCard key={mood.id} mood={mood} index={index} />
              ))
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-pink-500 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No mood entries yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Start tracking your emotional well-being today
                </p>
                <motion.button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log Your First Mood
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add Mood Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                className="card-glass max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Log Your Mood
                  </h2>
                  <motion.button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <form onSubmit={handleAddMood} className="space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedMood.date}
                      onChange={(e) => setSelectedMood(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Emoji Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      How are you feeling? (Optional)
                    </label>
                    <EmojiSelector
                      selectedEmoji={selectedMood.emoji}
                      onSelect={(emoji, rating) => setSelectedMood(prev => ({ 
                        ...prev, 
                        emoji, 
                        rating 
                      }))}
                    />
                  </div>

                  {/* Rating Slider */}
                  <div>
                    <RatingSlider
                      rating={selectedMood.rating}
                      onChange={(rating) => setSelectedMood(prev => ({ ...prev, rating }))}
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={selectedMood.note}
                      onChange={(e) => setSelectedMood(prev => ({ ...prev, note: e.target.value }))}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="What's on your mind? How was your day?"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Mood</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 btn-ghost"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MoodJournal;
