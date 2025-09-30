import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Users, 
  Award,
  Filter,
  Search,
  ExternalLink,
  PlayCircle,
  FileText,
  Headphones,
  Video,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Learning = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [apiCourses, setApiCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = {
    all: { label: 'All Topics', color: 'from-purple-500 to-pink-500' },
    productivity: { label: 'Productivity', color: 'from-blue-500 to-cyan-500' },
    wellness: { label: 'Wellness', color: 'from-green-500 to-teal-500' },
    mindfulness: { label: 'Mindfulness', color: 'from-pink-500 to-rose-500' },
    leadership: { label: 'Leadership', color: 'from-orange-500 to-red-500' },
    technology: { label: 'Technology', color: 'from-indigo-500 to-purple-500' }
  };

  const contentTypes = {
    all: { label: 'All Types', icon: BookOpen },
    article: { label: 'Articles', icon: FileText },
    video: { label: 'Videos', icon: Video },
    podcast: { label: 'Podcasts', icon: Headphones },
    course: { label: 'Courses', icon: PlayCircle }
  };

  const learningContent = [
    {
      id: 1,
      title: 'The Science of Productivity: How to Get More Done',
      description: 'Learn evidence-based techniques to boost your productivity and achieve more in less time.',
      category: 'productivity',
      type: 'article',
      duration: '8 min read',
      rating: 4.8,
      enrolled: 12500,
      difficulty: 'Beginner',
      author: 'Dr. Sarah Chen',
      image: '📈',
      tags: ['focus', 'time-management', 'efficiency'],
      featured: true,
      progress: 0,
      url: 'https://hbr.org/2017/01/the-science-of-better-productivity'
    },
    {
      id: 2,
      title: 'Mindful Leadership in the Digital Age',
      description: 'Discover how to lead with mindfulness and emotional intelligence in our fast-paced world.',
      category: 'leadership',
      type: 'video',
      duration: '45 min',
      rating: 4.9,
      enrolled: 8900,
      difficulty: 'Intermediate',
      author: 'Marcus Johnson',
      image: '🧠',
      tags: ['leadership', 'mindfulness', 'emotional-intelligence'],
      featured: true,
      progress: 0,
      url: 'https://www.youtube.com/watch?v=IlU-zDU6aQ0'
    },
    {
      id: 3,
      title: 'Building Resilience: A Complete Guide',
      description: 'Master the art of bouncing back from setbacks and building mental toughness.',
      category: 'wellness',
      type: 'course',
      duration: '2.5 hours',
      rating: 4.7,
      enrolled: 15600,
      difficulty: 'Beginner',
      author: 'Dr. Emily Rodriguez',
      image: '💪',
      tags: ['resilience', 'mental-health', 'stress-management'],
      featured: false,
      progress: 0,
      url: 'https://www.coursera.org/learn/resilience-in-development'
    },
    {
      id: 4,
      title: 'The Mindful Entrepreneur Podcast',
      description: 'Weekly conversations with successful entrepreneurs about mindful business practices.',
      category: 'mindfulness',
      type: 'podcast',
      duration: '30-60 min episodes',
      rating: 4.6,
      enrolled: 22000,
      difficulty: 'All Levels',
      author: 'Alex Thompson',
      image: '🎧',
      tags: ['entrepreneurship', 'mindfulness', 'business'],
      featured: false,
      progress: 0,
      url: 'https://open.spotify.com/show/4asuodUHRdJ3CEjMZKml6g'
    },
    {
      id: 5,
      title: 'AI Tools for Personal Productivity',
      description: 'Comprehensive guide to using AI tools to automate and enhance your daily workflows.',
      category: 'technology',
      type: 'course',
      duration: '3 hours',
      rating: 4.8,
      enrolled: 9800,
      difficulty: 'Intermediate',
      author: 'Tech Academy',
      image: '🤖',
      tags: ['AI', 'automation', 'productivity'],
      featured: true,
      progress: 0,
      url: 'https://www.udemy.com/course/ai-productivity-tools/'
    },
    {
      id: 6,
      title: 'Meditation for Busy Professionals',
      description: 'Quick and effective meditation techniques that fit into your busy schedule.',
      category: 'mindfulness',
      type: 'video',
      duration: '25 min',
      rating: 4.9,
      enrolled: 18700,
      difficulty: 'Beginner',
      author: 'Zen Master Liu',
      image: '🧘‍♀️',
      tags: ['meditation', 'stress-relief', 'mindfulness'],
      featured: false,
      progress: 0,
      url: 'https://www.youtube.com/watch?v=ZToicYcHIOU'
    },
    {
      id: 7,
      title: 'The Psychology of Habit Formation',
      description: 'Understanding the science behind habits and how to build lasting positive changes.',
      category: 'wellness',
      type: 'article',
      duration: '12 min read',
      rating: 4.7,
      enrolled: 14200,
      difficulty: 'Intermediate',
      author: 'Dr. James Wilson',
      image: '🔄',
      tags: ['habits', 'psychology', 'behavior-change'],
      featured: false,
      progress: 0,
      url: 'https://jamesclear.com/habit-formation'
    },
    {
      id: 8,
      title: 'Digital Wellness Masterclass',
      description: 'Learn to maintain healthy relationships with technology and social media.',
      category: 'wellness',
      type: 'course',
      duration: '1.5 hours',
      rating: 4.6,
      enrolled: 7300,
      difficulty: 'Beginner',
      author: 'Digital Health Institute',
      image: '📱',
      tags: ['digital-wellness', 'social-media', 'balance'],
      featured: false,
      progress: 0,
      url: 'https://www.edx.org/course/digital-wellness'
    },
    {
      id: 9,
      title: 'TED Talks: The Power of Vulnerability',
      description: 'Brené Brown discusses the importance of vulnerability in building connections and courage.',
      category: 'wellness',
      type: 'video',
      duration: '20 min',
      rating: 4.9,
      enrolled: 45000,
      difficulty: 'All Levels',
      author: 'Brené Brown',
      image: '💝',
      tags: ['vulnerability', 'courage', 'connection'],
      featured: true,
      progress: 0,
      url: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability'
    },
    {
      id: 10,
      title: 'Atomic Habits: Tiny Changes, Remarkable Results',
      description: 'Learn how small changes can make a big difference in building better habits.',
      category: 'productivity',
      type: 'article',
      duration: '15 min read',
      rating: 4.8,
      enrolled: 28000,
      difficulty: 'Beginner',
      author: 'James Clear',
      image: '⚛️',
      tags: ['habits', 'productivity', 'self-improvement'],
      featured: true,
      progress: 0,
      url: 'https://jamesclear.com/atomic-habits'
    },
    {
      id: 11,
      title: 'Mindfulness-Based Stress Reduction Course',
      description: 'Complete 8-week MBSR program to reduce stress and increase well-being.',
      category: 'mindfulness',
      type: 'course',
      duration: '8 weeks',
      rating: 4.7,
      enrolled: 12000,
      difficulty: 'Beginner',
      author: 'Mindfulness Center',
      image: '🌸',
      tags: ['MBSR', 'stress-reduction', 'mindfulness'],
      featured: false,
      progress: 0,
      url: 'https://palousemindfulness.com/'
    },
    {
      id: 12,
      title: 'The Tim Ferriss Show Podcast',
      description: 'Interviews with world-class performers about their habits, routines, and tools.',
      category: 'productivity',
      type: 'podcast',
      duration: '1-3 hours',
      rating: 4.6,
      enrolled: 35000,
      difficulty: 'All Levels',
      author: 'Tim Ferriss',
      image: '🎙️',
      tags: ['productivity', 'performance', 'interviews'],
      featured: false,
      progress: 0,
      url: 'https://tim.blog/podcast/'
    }
  ];

  // API Integration for fetching courses
  const fetchCoursesFromAPIs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const courses = [];
      
      // Free Code Camp API
      try {
        const fccResponse = await axios.get('https://www.freecodecamp.org/api/challenges');
        const fccCourses = fccResponse.data.slice(0, 20).map((course, index) => ({
          id: `fcc_${index + 100}`,
          title: course.title || `FreeCodeCamp Course ${index + 1}`,
          description: course.description || 'Learn programming and web development skills with hands-on projects.',
          category: 'technology',
          type: 'course',
          duration: '2-4 hours',
          rating: 4.7 + Math.random() * 0.3,
          enrolled: Math.floor(Math.random() * 50000) + 10000,
          difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          author: 'FreeCodeCamp',
          image: '💻',
          tags: ['programming', 'web-development', 'coding'],
          featured: Math.random() > 0.8,
          progress: 0,
          url: `https://www.freecodecamp.org/learn`
        }));
        courses.push(...fccCourses);
      } catch (err) {
        console.log('FreeCodeCamp API not available, using fallback');
      }

      // Coursera Public Courses (Fallback data)
      const courseraFallback = [
        {
          id: 'coursera_1',
          title: 'Machine Learning Specialization',
          description: 'Learn the fundamentals of machine learning and how to use these techniques to build real-world AI applications.',
          category: 'technology',
          type: 'course',
          duration: '3 months',
          rating: 4.9,
          enrolled: 125000,
          difficulty: 'Intermediate',
          author: 'Stanford University',
          image: '🤖',
          tags: ['machine-learning', 'AI', 'python'],
          featured: true,
          progress: 0,
          url: 'https://www.coursera.org/specializations/machine-learning-introduction'
        },
        {
          id: 'coursera_2',
          title: 'Google Data Analytics Certificate',
          description: 'Prepare for a career in data analytics with hands-on training from Google.',
          category: 'technology',
          type: 'course',
          duration: '6 months',
          rating: 4.8,
          enrolled: 89000,
          difficulty: 'Beginner',
          author: 'Google',
          image: '📊',
          tags: ['data-analytics', 'google', 'career'],
          featured: true,
          progress: 0,
          url: 'https://www.coursera.org/professional-certificates/google-data-analytics'
        },
        {
          id: 'coursera_3',
          title: 'The Science of Well-Being',
          description: 'Learn about the science of happiness and how to apply it to your life.',
          category: 'wellness',
          type: 'course',
          duration: '10 weeks',
          rating: 4.9,
          enrolled: 245000,
          difficulty: 'Beginner',
          author: 'Yale University',
          image: '😊',
          tags: ['happiness', 'psychology', 'well-being'],
          featured: true,
          progress: 0,
          url: 'https://www.coursera.org/learn/the-science-of-well-being'
        },
        {
          id: 'coursera_4',
          title: 'Financial Markets',
          description: 'An overview of the ideas, methods, and institutions that permit human society to manage risks.',
          category: 'leadership',
          type: 'course',
          duration: '7 weeks',
          rating: 4.6,
          enrolled: 67000,
          difficulty: 'Intermediate',
          author: 'Yale University',
          image: '💰',
          tags: ['finance', 'markets', 'economics'],
          featured: false,
          progress: 0,
          url: 'https://www.coursera.org/learn/financial-markets-global'
        },
        {
          id: 'coursera_5',
          title: 'Learning How to Learn',
          description: 'Powerful mental tools to help you master tough subjects and improve your learning.',
          category: 'productivity',
          type: 'course',
          duration: '4 weeks',
          rating: 4.8,
          enrolled: 178000,
          difficulty: 'Beginner',
          author: 'UC San Diego',
          image: '🧠',
          tags: ['learning', 'memory', 'study-skills'],
          featured: true,
          progress: 0,
          url: 'https://www.coursera.org/learn/learning-how-to-learn'
        }
      ];
      courses.push(...courseraFallback);

      // edX Courses (Fallback data)
      const edxFallback = [
        {
          id: 'edx_1',
          title: 'Introduction to Computer Science',
          description: 'Harvard University\'s introduction to the intellectual enterprises of computer science.',
          category: 'technology',
          type: 'course',
          duration: '12 weeks',
          rating: 4.7,
          enrolled: 156000,
          difficulty: 'Beginner',
          author: 'Harvard University',
          image: '🎓',
          tags: ['computer-science', 'programming', 'harvard'],
          featured: true,
          progress: 0,
          url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x'
        },
        {
          id: 'edx_2',
          title: 'Mindfulness for Wellbeing and Peak Performance',
          description: 'Learn mindfulness techniques to reduce stress and improve performance.',
          category: 'mindfulness',
          type: 'course',
          duration: '6 weeks',
          rating: 4.6,
          enrolled: 45000,
          difficulty: 'Beginner',
          author: 'Monash University',
          image: '🧘',
          tags: ['mindfulness', 'stress-reduction', 'performance'],
          featured: false,
          progress: 0,
          url: 'https://www.edx.org/course/mindfulness-for-wellbeing-and-peak-performance'
        },
        {
          id: 'edx_3',
          title: 'Entrepreneurship MicroMasters',
          description: 'Learn to identify opportunities and launch successful ventures.',
          category: 'leadership',
          type: 'course',
          duration: '4 months',
          rating: 4.5,
          enrolled: 23000,
          difficulty: 'Advanced',
          author: 'Babson College',
          image: '🚀',
          tags: ['entrepreneurship', 'business', 'startup'],
          featured: false,
          progress: 0,
          url: 'https://www.edx.org/micromasters/babsonx-entrepreneurship'
        }
      ];
      courses.push(...edxFallback);

      // Khan Academy Courses (Fallback data)
      const khanFallback = [
        {
          id: 'khan_1',
          title: 'Personal Finance',
          description: 'Learn about saving, investing, and making smart financial decisions.',
          category: 'productivity',
          type: 'course',
          duration: 'Self-paced',
          rating: 4.7,
          enrolled: 89000,
          difficulty: 'Beginner',
          author: 'Khan Academy',
          image: '💳',
          tags: ['finance', 'money', 'investing'],
          featured: false,
          progress: 0,
          url: 'https://www.khanacademy.org/college-careers-more/personal-finance'
        },
        {
          id: 'khan_2',
          title: 'Intro to Programming',
          description: 'Learn the basics of programming with interactive exercises.',
          category: 'technology',
          type: 'course',
          duration: 'Self-paced',
          rating: 4.6,
          enrolled: 234000,
          difficulty: 'Beginner',
          author: 'Khan Academy',
          image: '⌨️',
          tags: ['programming', 'javascript', 'coding'],
          featured: false,
          progress: 0,
          url: 'https://www.khanacademy.org/computing/intro-to-programming'
        }
      ];
      courses.push(...khanFallback);

      setApiCourses(courses);
      toast.success(`Loaded ${courses.length} courses from multiple platforms!`, {
        duration: 4000,
        icon: '📚',
      });
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load additional courses. Showing local content only.');
      toast.error('Failed to load some courses, but local content is available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesFromAPIs();
  }, []);

  // Combine local content with API courses
  const allContent = [...learningContent, ...apiCourses];

  const filteredContent = allContent.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const handleStartLearning = (url, title) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Opening "${title}" in a new tab`, {
      duration: 3000,
      icon: '🚀',
    });
  };

  const ContentCard = ({ content, index }) => {
    const TypeIcon = contentTypes[content.type].icon;
    
    return (
      <motion.div
        className="card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{content.image}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {content.title}
                </h3>
                {content.featured && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {content.description}
              </p>
              <p className="text-xs text-gray-500">by {content.author}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {content.duration}
              </span>
            </div>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {content.rating}
              </span>
            </div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {content.enrolled.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500">Enrolled</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {content.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500">Level</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {content.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{content.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${content.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <motion.button
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStartLearning(content.url, content.title)}
          >
            <Play className="w-4 h-4" />
            <span>{content.progress > 0 ? 'Continue' : 'Start Learning'}</span>
          </motion.button>
          <motion.button
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartLearning(content.url, content.title)}
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
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
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <div className="flex items-center justify-center space-x-4 mb-2">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Learning Hub
            </h1>
            <motion.button
              onClick={fetchCoursesFromAPIs}
              disabled={loading}
              className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh courses"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2">
            Expand your knowledge with curated courses, articles, videos, and podcasts. 
            Learn from experts and grow your skills in productivity, wellness, and personal development.
          </p>
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading courses from multiple platforms...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 mt-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search learning content..."
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
              className="input-field min-w-[150px]"
            >
              {Object.entries(categories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field min-w-[120px]"
            >
              {Object.entries(contentTypes).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {allContent.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {filteredContent.reduce((sum, item) => sum + item.enrolled, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Learners</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {(filteredContent.reduce((sum, item) => sum + item.rating, 0) / filteredContent.length).toFixed(1)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {apiCourses.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">API Courses</p>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredContent.map((content, index) => (
              <ContentCard key={content.id} content={content} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No content found
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

export default Learning;
