import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Heart, 
  TrendingUp, 
  Calendar,
  Target,
  Smile,
  Award,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalMoods: 0,
    averageMood: 0,
    todayTasks: 0,
    todayCompletedTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRandomQuote();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, moodsResponse, moodStatsResponse] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/moods'),
        axios.get('/api/moods/stats')
      ]);

      const tasks = tasksResponse.data.tasks;
      const moods = moodsResponse.data.moods;
      const moodStats = moodStatsResponse.data.stats;

      // Calculate task stats
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasks.filter(task => 
        task.createdAt.split('T')[0] === today
      );
      const todayCompletedTasks = todayTasks.filter(task => task.completed);

      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.completed).length,
        totalMoods: moodStats.totalMoods,
        averageMood: moodStats.averageRating,
        todayTasks: todayTasks.length,
        todayCompletedTasks: todayCompletedTasks.length
      });

      // Get recent tasks (last 5)
      setRecentTasks(tasks.slice(0, 5));

      // Format mood data for chart
      setMoodData(moodStats.dailyAverages.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: item.average,
        count: item.count
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get('/api/quotes/random');
      setQuote(response.data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const todayCompletionPercentage = stats.todayTasks > 0 
    ? Math.round((stats.todayCompletedTasks / stats.todayTasks) * 100) 
    : 0;

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay = 0 }) => (
    <motion.div
      className="card p-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <motion.p
            className="text-3xl font-bold text-gray-800 dark:text-white mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <motion.div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#3b82f6' }) => (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * ((size - strokeWidth) / 2)}`}
          initial={{ strokeDashoffset: 2 * Math.PI * ((size - strokeWidth) / 2) }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * ((size - strokeWidth) / 2) * (1 - percentage / 100)
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-gray-800 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
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
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-24 h-24 rounded-full opacity-5 ${
                i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={floatingVariants}
              animate="animate"
            />
          ))}
        </div>

        {/* Header */}
        <motion.div
          className="mb-8 relative z-10"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl font-bold text-gray-800 dark:text-white mb-2"
            variants={pulseVariants}
            animate="animate"
          >
            Welcome back, {user?.name}! 👋
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            variants={itemVariants}
          >
            Here's your mindful journey overview for today
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10"
          variants={containerVariants}
        >
          <StatCard
            icon={CheckSquare}
            title="Total Tasks"
            value={stats.totalTasks}
            subtitle={`${stats.completedTasks} completed`}
            color="from-blue-500 to-blue-600"
            delay={0.1}
          />
          <StatCard
            icon={Target}
            title="Today's Tasks"
            value={stats.todayTasks}
            subtitle={`${stats.todayCompletedTasks} completed`}
            color="from-green-500 to-green-600"
            delay={0.2}
          />
          <StatCard
            icon={Heart}
            title="Mood Entries"
            value={stats.totalMoods}
            subtitle={`${stats.averageMood}/10 average`}
            color="from-pink-500 to-pink-600"
            delay={0.3}
          />
          <StatCard
            icon={TrendingUp}
            title="Completion Rate"
            value={`${completionPercentage}%`}
            subtitle="Overall progress"
            color="from-purple-500 to-purple-600"
            delay={0.4}
          />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 mb-8 relative z-10"
          variants={containerVariants}
        >
          {/* Progress Charts */}
          <motion.div
            className="lg:col-span-2 card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Progress Overview
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Overall Progress */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Overall Completion
                </h3>
                <CircularProgress 
                  percentage={completionPercentage} 
                  color="#3b82f6"
                />
              </div>

              {/* Today's Progress */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Today's Progress
                </h3>
                <CircularProgress 
                  percentage={todayCompletionPercentage} 
                  color="#10b981"
                />
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Quick Actions
            </h2>
            
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/tasks"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Add Task</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/mood"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Smile className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Log Mood</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/community"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">Get Inspired</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 relative z-10"
          variants={containerVariants}
        >
          {/* Mood Trend Chart */}
          <motion.div
            className="lg:col-span-2 card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Mood Trend (Last 7 Days)
            </h2>
            
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    domain={[0, 10]}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No mood data yet. Start logging your moods!</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Daily Quote */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Daily Inspiration
            </h2>
            
            {quote ? (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.div>
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
                  "{quote.text}"
                </blockquote>
                <p className="text-gray-500 dark:text-gray-500 font-medium">
                  — {quote.author}
                </p>
              </motion.div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="spinner mx-auto mb-4" />
                <p>Loading inspiration...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
