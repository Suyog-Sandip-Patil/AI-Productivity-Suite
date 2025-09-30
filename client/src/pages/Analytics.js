import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  Clock,
  Heart,
  CheckSquare,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Star
} from 'lucide-react';
import axios from 'axios';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [tasksResponse, moodsResponse] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/moods')
      ]);
      
      setTasks(tasksResponse.data.tasks);
      setMoods(moodsResponse.data.moods);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate task completion trends
  const getTaskTrends = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayTasks = tasks.filter(task => 
        task.createdAt.split('T')[0] === dateStr
      );
      const completedTasks = dayTasks.filter(task => task.completed);
      
      trends.push({
        date: format(date, timeRange === 'week' ? 'EEE' : 'MMM dd'),
        total: dayTasks.length,
        completed: completedTasks.length,
        completionRate: dayTasks.length > 0 ? (completedTasks.length / dayTasks.length) * 100 : 0
      });
    }
    
    return trends;
  };

  // Calculate mood trends
  const getMoodTrends = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayMoods = moods.filter(mood => 
        (mood.date || mood.createdAt.split('T')[0]) === dateStr
      );
      
      const avgMood = dayMoods.length > 0 
        ? dayMoods.reduce((sum, mood) => sum + (mood.rating || 5), 0) / dayMoods.length 
        : 0;
      
      trends.push({
        date: format(date, timeRange === 'week' ? 'EEE' : 'MMM dd'),
        mood: Math.round(avgMood * 10) / 10,
        entries: dayMoods.length
      });
    }
    
    return trends;
  };

  // Calculate priority distribution
  const getPriorityDistribution = () => {
    const distribution = { high: 0, medium: 0, low: 0 };
    tasks.forEach(task => {
      distribution[task.priority] = (distribution[task.priority] || 0) + 1;
    });
    
    return [
      { name: 'High Priority', value: distribution.high, color: '#ef4444' },
      { name: 'Medium Priority', value: distribution.medium, color: '#f59e0b' },
      { name: 'Low Priority', value: distribution.low, color: '#10b981' }
    ];
  };

  // Calculate productivity score
  const getProductivityScore = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const recentTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const weekAgo = subDays(new Date(), 7);
      return taskDate >= weekAgo;
    });
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const activityScore = Math.min(recentTasks.length * 10, 100);
    const moodScore = moods.length > 0 
      ? (moods.reduce((sum, mood) => sum + (mood.rating || 5), 0) / moods.length) * 10 
      : 50;
    
    return Math.round((completionRate + activityScore + moodScore) / 3);
  };

  const taskTrends = getTaskTrends();
  const moodTrends = getMoodTrends();
  const priorityData = getPriorityDistribution();
  const productivityScore = getProductivityScore();

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, delay = 0 }) => (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
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
      
      {trend && (
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last period
          </span>
        </div>
      )}
    </motion.div>
  );

  const ProductivityGauge = ({ score }) => (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="56"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 56}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - score / 100) }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.span
            className="text-2xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {score}
          </motion.span>
          <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
        </div>
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
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Insights into your productivity and wellness journey
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CheckSquare}
            title="Total Tasks"
            value={tasks.length}
            subtitle={`${tasks.filter(t => t.completed).length} completed`}
            color="from-blue-500 to-blue-600"
            trend={12}
            delay={0.1}
          />
          <StatCard
            icon={Target}
            title="Completion Rate"
            value={`${Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}%`}
            subtitle="Overall progress"
            color="from-green-500 to-green-600"
            trend={8}
            delay={0.2}
          />
          <StatCard
            icon={Heart}
            title="Average Mood"
            value={moods.length > 0 ? Math.round(moods.reduce((sum, m) => sum + (m.rating || 5), 0) / moods.length * 10) / 10 : 'N/A'}
            subtitle={`${moods.length} entries`}
            color="from-pink-500 to-pink-600"
            trend={5}
            delay={0.3}
          />
          <StatCard
            icon={Zap}
            title="Productivity Score"
            value={productivityScore}
            subtitle="Based on activity"
            color="from-purple-500 to-purple-600"
            trend={15}
            delay={0.4}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Task Completion Trends */}
          <motion.div
            className="lg:col-span-2 card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Task Completion Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={taskTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Productivity Score */}
          <motion.div
            className="card p-6 text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center justify-center">
              <Activity className="w-5 h-5 mr-2" />
              Productivity Score
            </h2>
            <ProductivityGauge score={productivityScore} />
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Task Completion</span>
                <span className="font-medium">{Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Recent Activity</span>
                <span className="font-medium">{Math.min(tasks.filter(t => {
                  const taskDate = new Date(t.createdAt);
                  const weekAgo = subDays(new Date(), 7);
                  return taskDate >= weekAgo;
                }).length * 10, 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Mood Score</span>
                <span className="font-medium">{moods.length > 0 ? Math.round((moods.reduce((sum, m) => sum + (m.rating || 5), 0) / moods.length) * 10) : 50}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Trends */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Mood Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
                <YAxis domain={[0, 10]} className="text-gray-600 dark:text-gray-400" />
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
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2" />
              Task Priority Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          className="mt-8 card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Insights & Recommendations
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Productivity Tip</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Your completion rate is {Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}%. 
                Try breaking larger tasks into smaller, manageable chunks to boost your success rate!
              </p>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">Mood Pattern</h3>
              <p className="text-pink-700 dark:text-pink-400 text-sm">
                {moods.length > 0 
                  ? `Your average mood is ${Math.round(moods.reduce((sum, m) => sum + (m.rating || 5), 0) / moods.length * 10) / 10}/10. Keep tracking to identify patterns!`
                  : 'Start logging your moods to discover patterns and improve your well-being!'
                }
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Achievement</h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                You've created {tasks.length} tasks and completed {tasks.filter(t => t.completed).length}. 
                Every step forward is progress worth celebrating! 🎉
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
