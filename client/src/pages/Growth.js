import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  TrendingUp, 
  Star, 
  Clock, 
  Users, 
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  ExternalLink,
  Heart,
  Brain,
  Award,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

const Growth = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Categories for filtering
  const categories = {
    all: { label: 'All Opportunities', icon: Rocket, color: 'from-purple-500 to-pink-500' },
    productivity: { label: 'Productivity', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    wellness: { label: 'Wellness', icon: Heart, color: 'from-green-500 to-teal-500' },
    learning: { label: 'Learning', icon: BookOpen, color: 'from-indigo-500 to-purple-500' },
    mindfulness: { label: 'Mindfulness', icon: Brain, color: 'from-pink-500 to-rose-500' },
    career: { label: 'Career', icon: Target, color: 'from-orange-500 to-red-500' },
    social: { label: 'Social', icon: Users, color: 'from-emerald-500 to-green-500' }
  };

  // Simulated real-time trending opportunities
  const getTrendingOpportunities = () => {
    const baseOpportunities = [
      {
        id: 1,
        title: '21-Day Mindfulness Challenge',
        description: 'Transform your daily routine with guided mindfulness practices. Join thousands of users building lasting meditation habits.',
        category: 'mindfulness',
        difficulty: 'Beginner',
        duration: '21 days',
        participants: 15420,
        trending: true,
        featured: true,
        tags: ['meditation', 'stress-relief', 'habits'],
        benefits: ['Reduced stress', 'Better focus', 'Improved sleep'],
        action: 'Start Challenge',
        link: '/habits',
        image: '🧘‍♀️',
        timeToComplete: '10-15 min/day',
        completionRate: 78
      },
      {
        id: 2,
        title: 'AI-Powered Productivity Bootcamp',
        description: 'Learn cutting-edge productivity techniques using AI tools. Boost your efficiency by 300% in just 7 days.',
        category: 'productivity',
        difficulty: 'Intermediate',
        duration: '7 days',
        participants: 8930,
        trending: true,
        featured: false,
        tags: ['AI', 'automation', 'efficiency'],
        benefits: ['3x productivity', 'AI mastery', 'Time freedom'],
        action: 'Join Bootcamp',
        link: '/chatbot',
        image: '🤖',
        timeToComplete: '30-45 min/day',
        completionRate: 85
      },
      {
        id: 3,
        title: 'Emotional Intelligence Masterclass',
        description: 'Develop your EQ with science-based techniques. Improve relationships and career success through emotional mastery.',
        category: 'wellness',
        difficulty: 'Advanced',
        duration: '14 days',
        participants: 12100,
        trending: false,
        featured: true,
        tags: ['EQ', 'relationships', 'leadership'],
        benefits: ['Better relationships', 'Leadership skills', 'Self-awareness'],
        action: 'Start Learning',
        link: '/mood',
        image: '💝',
        timeToComplete: '20-30 min/day',
        completionRate: 72
      },
      {
        id: 4,
        title: 'Digital Detox & Focus Sprint',
        description: 'Reclaim your attention in the digital age. Learn to focus deeply and reduce screen time addiction.',
        category: 'wellness',
        difficulty: 'Beginner',
        duration: '10 days',
        participants: 6750,
        trending: true,
        featured: false,
        tags: ['focus', 'digital-wellness', 'attention'],
        benefits: ['Deep focus', 'Less distraction', 'Mental clarity'],
        action: 'Begin Detox',
        link: '/tasks',
        image: '📱',
        timeToComplete: '15-25 min/day',
        completionRate: 81
      },
      {
        id: 5,
        title: 'Goal Achievement Accelerator',
        description: 'Turn your dreams into reality with proven goal-setting frameworks. Achieve 5x more in less time.',
        category: 'career',
        difficulty: 'Intermediate',
        duration: '30 days',
        participants: 9840,
        trending: false,
        featured: true,
        tags: ['goals', 'achievement', 'success'],
        benefits: ['Goal clarity', 'Faster results', 'Success habits'],
        action: 'Set Goals',
        link: '/goals',
        image: '🎯',
        timeToComplete: '25-35 min/day',
        completionRate: 69
      },
      {
        id: 6,
        title: 'Social Connection Challenge',
        description: 'Build meaningful relationships and expand your network. Combat loneliness and create lasting bonds.',
        category: 'social',
        difficulty: 'Beginner',
        duration: '14 days',
        participants: 4320,
        trending: true,
        featured: false,
        tags: ['networking', 'relationships', 'community'],
        benefits: ['New connections', 'Social confidence', 'Support network'],
        action: 'Connect Now',
        link: '/community',
        image: '🤝',
        timeToComplete: '20-30 min/day',
        completionRate: 76
      },
      {
        id: 7,
        title: 'Learning Velocity Accelerator',
        description: 'Master any skill 10x faster with advanced learning techniques. Unlock your learning potential.',
        category: 'learning',
        difficulty: 'Advanced',
        duration: '21 days',
        participants: 7650,
        trending: false,
        featured: false,
        tags: ['learning', 'skills', 'memory'],
        benefits: ['Faster learning', 'Better retention', 'Skill mastery'],
        action: 'Learn Faster',
        link: '/learning',
        image: '🚀',
        timeToComplete: '30-40 min/day',
        completionRate: 74
      },
      {
        id: 8,
        title: 'Morning Routine Optimization',
        description: 'Design the perfect morning routine for peak performance. Start every day with energy and purpose.',
        category: 'productivity',
        difficulty: 'Beginner',
        duration: '7 days',
        participants: 11200,
        trending: true,
        featured: true,
        tags: ['morning-routine', 'habits', 'energy'],
        benefits: ['More energy', 'Better days', 'Consistent habits'],
        action: 'Optimize Morning',
        link: '/habits',
        image: '🌅',
        timeToComplete: '5-10 min setup',
        completionRate: 88
      }
    ];

    // Add some randomization to simulate real-time updates
    return baseOpportunities.map(opp => ({
      ...opp,
      participants: opp.participants + Math.floor(Math.random() * 100),
      trending: Math.random() > 0.6 ? true : opp.trending
    })).sort((a, b) => {
      // Sort by trending first, then by participants
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return b.participants - a.participants;
    });
  };

  // Load opportunities
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = getTrendingOpportunities();
      setOpportunities(data);
      setFilteredOpportunities(data);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter opportunities
  useEffect(() => {
    let filtered = opportunities;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(opp => opp.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, selectedCategory, searchTerm]);

  const OpportunityCard = ({ opportunity, index }) => {
    const category = categories[opportunity.category];
    
    return (
      <motion.div
        className="card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={() => window.location.href = opportunity.link}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{opportunity.image}</div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {opportunity.title}
                </h3>
                {opportunity.trending && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </span>
                )}
                {opportunity.featured && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {opportunity.description}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {opportunity.duration}
              </span>
            </div>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {opportunity.participants.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500">Participants</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {opportunity.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500">Level</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {opportunity.completionRate}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benefits:</h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.benefits.map((benefit, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {opportunity.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          className={`w-full btn-primary flex items-center justify-center space-x-2 bg-gradient-to-r ${category.color}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{opportunity.action}</span>
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Rocket className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Personal Growth Opportunities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover trending growth opportunities tailored to boost your productivity, wellness, and personal development. 
            Join thousands of others on their journey to success.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field min-w-[200px]"
            >
              {Object.entries(categories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Opportunities Grid */}
        {!loading && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence>
              {filteredOpportunities.map((opportunity, index) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredOpportunities.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No opportunities found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Growth;
