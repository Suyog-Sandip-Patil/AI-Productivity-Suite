import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Quote, 
  Plus, 
  Heart, 
  Users, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Send,
  X,
  Star,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuote, setNewQuote] = useState({
    text: '',
    author: ''
  });
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (autoPlay && quotes.length > 1) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, quotes.length]);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes');
      setQuotes(response.data.quotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    
    if (!newQuote.text.trim()) {
      toast.error('Please enter a quote');
      return;
    }

    try {
      const response = await axios.post('/api/quotes', {
        text: newQuote.text.trim(),
        author: newQuote.author.trim() || 'Anonymous'
      });
      
      setQuotes(prev => [response.data.quote, ...prev]);
      setNewQuote({ text: '', author: '' });
      setShowAddModal(false);
      toast.success('Quote shared successfully! 🌟');
    } catch (error) {
      console.error('Error adding quote:', error);
      toast.error('Failed to share quote');
    }
  };

  const nextQuote = () => {
    setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex(prev => (prev - 1 + quotes.length) % quotes.length);
  };

  const goToQuote = (index) => {
    setCurrentQuoteIndex(index);
  };

  const QuoteCard = ({ quote, isActive, index }) => (
    <motion.div
      className={`absolute inset-0 card-glass p-8 flex flex-col justify-center text-center ${
        isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        scale: isActive ? 1 : 0.8,
        rotateY: isActive ? 0 : 90,
        z: isActive ? 10 : 0
      }}
      exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeInOut",
        delay: isActive ? 0.1 : 0
      }}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.div
        className="mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: isActive ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Quote className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <motion.blockquote
        className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white mb-6 leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        "{quote.text}"
      </motion.blockquote>

      <motion.div
        className="space-y-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          — {quote.author}
        </p>
        {quote.submittedByName && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Shared by {quote.submittedByName}
          </p>
        )}
      </motion.div>

      <motion.div
        className="mt-8 flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: isActive ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading community quotes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Community Inspiration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover and share motivational quotes that inspire mindful living and personal growth
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="card p-6 text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {quotes.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Quotes</p>
          </div>

          <div className="card p-6 text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {new Set(quotes.filter(q => q.submittedBy).map(q => q.submittedBy)).size}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Contributors</p>
          </div>

          <div className="card p-6 text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Daily
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Inspiration</p>
          </div>
        </motion.div>

        {/* Quote Carousel */}
        {quotes.length > 0 && (
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative h-96 md:h-80 overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                {quotes.map((quote, index) => (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    isActive={index === currentQuoteIndex}
                    index={index}
                  />
                ))}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <motion.button
                onClick={prevQuote}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                onClick={nextQuote}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              {/* Auto-play toggle */}
              <motion.button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  autoPlay 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {autoPlay ? 'Auto' : 'Manual'}
              </motion.button>
            </div>

            {/* Dots Indicator */}
            <motion.div
              className="flex justify-center mt-6 space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {quotes.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToQuote(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentQuoteIndex
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Add Quote Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Share Your Inspiration
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Have a quote that motivates you? Share it with the community and inspire others on their mindful journey.
          </p>

          <motion.button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Share a Quote</span>
          </motion.button>
        </motion.div>

        {/* Add Quote Modal */}
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
                className="card-glass max-w-lg w-full p-6"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Share a Quote
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

                <form onSubmit={handleAddQuote} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quote Text *
                    </label>
                    <textarea
                      value={newQuote.text}
                      onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
                      className="input-field resize-none"
                      rows="4"
                      placeholder="Enter an inspiring quote..."
                      required
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {newQuote.text.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={newQuote.author}
                      onChange={(e) => setNewQuote(prev => ({ ...prev, author: e.target.value }))}
                      className="input-field"
                      placeholder="Author name (optional)"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-4 h-4" />
                      <span>Share Quote</span>
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

export default Community;
