import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Flag,
  TrendingUp,
  Award,
  Save,
  X,
  BarChart3
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    progress: 0,
    totalSteps: 100
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('mindful-day-goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals.map(goal => ({
          ...goal,
          targetDate: new Date(goal.targetDate),
          createdAt: new Date(goal.createdAt)
        })));
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals(getDefaultGoals());
      }
    } else {
      setGoals(getDefaultGoals());
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('mindful-day-goals', JSON.stringify(goals));
    }
  }, [goals]);

  // Default goals for new users
  const getDefaultGoals = () => [
    {
      id: 1,
      title: 'Complete 30-Day Meditation Challenge',
      description: 'Meditate for at least 10 minutes every day for 30 consecutive days',
      category: 'wellness',
      priority: 'high',
      targetDate: addDays(new Date(), 23),
      progress: 23,
      totalSteps: 30,
      milestones: [
        { id: 1, title: 'Complete first week', completed: true, date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
        { id: 2, title: 'Reach 15 days', completed: true, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        { id: 3, title: 'Complete 30 days', completed: false, date: addDays(new Date(), 7) }
      ],
      createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Read 12 Books This Year',
      description: 'Expand knowledge and improve focus by reading one book per month',
      category: 'learning',
      priority: 'medium',
      targetDate: new Date(new Date().getFullYear(), 11, 31),
      progress: 8,
      totalSteps: 12,
      milestones: [
        { id: 1, title: 'Read 3 books', completed: true, date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        { id: 2, title: 'Read 6 books', completed: true, date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
        { id: 3, title: 'Read 9 books', completed: false, date: addDays(new Date(), 30) },
        { id: 4, title: 'Complete 12 books', completed: false, date: new Date(new Date().getFullYear(), 11, 31) }
      ],
      createdAt: new Date(new Date().getFullYear(), 0, 1)
    },
    {
      id: 3,
      title: 'Launch Personal Website',
      description: 'Create and deploy a personal portfolio website to showcase my work',
      category: 'career',
      priority: 'high',
      targetDate: addDays(new Date(), 45),
      progress: 3,
      totalSteps: 8,
      milestones: [
        { id: 1, title: 'Design wireframes', completed: true, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { id: 2, title: 'Set up development environment', completed: true, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
        { id: 3, title: 'Create homepage', completed: true, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { id: 4, title: 'Add portfolio section', completed: false, date: addDays(new Date(), 10) },
        { id: 5, title: 'Implement contact form', completed: false, date: addDays(new Date(), 20) },
        { id: 6, title: 'Deploy to production', completed: false, date: addDays(new Date(), 35) }
      ],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ];

  const categories = {
    wellness: { label: 'Wellness', icon: '🧘‍♀️', color: 'from-green-500 to-teal-500' },
    learning: { label: 'Learning', icon: '📚', color: 'from-blue-500 to-indigo-500' },
    career: { label: 'Career', icon: '💼', color: 'from-purple-500 to-pink-500' },
    fitness: { label: 'Fitness', icon: '💪', color: 'from-red-500 to-orange-500' },
    creative: { label: 'Creative', icon: '🎨', color: 'from-yellow-500 to-orange-500' },
    financial: { label: 'Financial', icon: '💰', color: 'from-green-600 to-emerald-600' }
  };

  const priorities = {
    low: { label: 'Low', color: 'bg-gray-500' },
    medium: { label: 'Medium', color: 'bg-yellow-500' },
    high: { label: 'High', color: 'bg-red-500' }
  };

  // Add editing functions
  const startEditing = (goal) => {
    setEditingGoal({
      ...goal,
      targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd')
    });
  };

  const cancelEditing = () => {
    setEditingGoal(null);
  };

  const saveEdit = () => {
    if (editingGoal && editingGoal.title.trim()) {
      updateGoal(editingGoal.id, {
        ...editingGoal,
        targetDate: new Date(editingGoal.targetDate)
      });
    }
  };

  const updateGoal = (goalId, updatedData) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updatedData } : goal
    ));
    setEditingGoal(null);
  };

  const deleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }
  };

  const updateProgress = (goalId, newProgress) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, progress: Math.min(newProgress, goal.totalSteps) } : goal
    ));
  };

  const resetNewGoal = () => {
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      progress: 0,
      totalSteps: 100
    });
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      targetDate: new Date(newGoal.targetDate),
      progress: 0,
      milestones: [],
      createdAt: new Date()
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'wellness',
      priority: 'medium',
      targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      totalSteps: 1
    });
    setShowAddModal(false);
  };

  const getDaysRemaining = (targetDate) => {
    return differenceInDays(new Date(targetDate), new Date());
  };

  const getProgressPercentage = (progress, total) => {
    return Math.round((progress / total) * 100);
  };

  const GoalCard = ({ goal, index }) => {
    const category = categories[goal.category];
    const priority = priorities[goal.priority];
    const daysRemaining = getDaysRemaining(goal.targetDate);
    const progressPercentage = getProgressPercentage(goal.progress, goal.totalSteps);
    const completedMilestones = goal.milestones.filter(m => m.completed).length;

    return (
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <motion.div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              {category.icon}
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {goal.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs text-white font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {goal.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {daysRemaining > 0 ? `${daysRemaining} days left` : 
                     daysRemaining === 0 ? 'Due today' : 
                     `${Math.abs(daysRemaining)} days overdue`}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flag className="w-4 h-4" />
                  <span>{category.label}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => deleteGoal(goal.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress: {goal.progress}/{goal.totalSteps}
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {progressPercentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            <motion.button
              onClick={() => updateProgress(goal.id, goal.progress - 1)}
              disabled={goal.progress <= 0}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              -1
            </motion.button>
            <motion.button
              onClick={() => updateProgress(goal.id, goal.progress + 1)}
              disabled={goal.progress >= goal.totalSteps}
              className="text-xs px-2 py-1 bg-primary-500 text-white rounded disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +1
            </motion.button>
          </div>
        </div>

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Milestones
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedMilestones}/{goal.milestones.length} completed
              </span>
            </div>
            
            <div className="space-y-2">
              {goal.milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    milestone.completed 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-sm flex-1 ${
                    milestone.completed 
                      ? 'text-green-700 dark:text-green-300 line-through' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {milestone.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(milestone.date), 'MMM dd')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay = 0 }) => (
    <motion.div
      className="card p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <motion.div
        className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <motion.p
        className="text-2xl font-bold text-gray-800 dark:text-white mb-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {value}
      </motion.p>
      <p className="text-gray-600 dark:text-gray-400 font-medium">{title}</p>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
      )}
    </motion.div>
  );

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.progress >= goal.totalSteps).length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + getProgressPercentage(goal.progress, goal.totalSteps), 0) / goals.length)
    : 0;
  const upcomingDeadlines = goals.filter(goal => {
    const days = getDaysRemaining(goal.targetDate);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Goals & Objectives
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set ambitious goals and track your progress toward achieving them
            </p>
          </div>

          <motion.button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Goal</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Target}
            title="Total Goals"
            value={totalGoals}
            color="from-blue-500 to-blue-600"
            delay={0.1}
          />
          <StatCard
            icon={Award}
            title="Completed"
            value={completedGoals}
            subtitle={`${totalGoals - completedGoals} in progress`}
            color="from-green-500 to-green-600"
            delay={0.2}
          />
          <StatCard
            icon={BarChart3}
            title="Average Progress"
            value={`${averageProgress}%`}
            color="from-purple-500 to-purple-600"
            delay={0.3}
          />
          <StatCard
            icon={Clock}
            title="Due This Week"
            value={upcomingDeadlines}
            subtitle="Upcoming deadlines"
            color="from-orange-500 to-red-500"
            delay={0.4}
          />
        </div>

        {/* Goals Grid */}
        <motion.div
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {goals.length > 0 ? (
              goals.map((goal, index) => (
                <GoalCard key={goal.id} goal={goal} index={index} />
              ))
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <Target className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No goals set yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Start setting meaningful goals to guide your personal growth
                </p>
                <motion.button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Set Your First Goal
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add Goal Modal */}
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Create New Goal
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Title *
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="e.g., Learn a new language"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Describe your goal and why it's important to you"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field"
                      >
                        {Object.entries(categories).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newGoal.priority}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                        className="input-field"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                        className="input-field"
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Steps
                      </label>
                      <input
                        type="number"
                        value={newGoal.totalSteps}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, totalSteps: parseInt(e.target.value) || 1 }))}
                        className="input-field"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      onClick={addGoal}
                      className="flex-1 btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create Goal
                    </motion.button>
                    <motion.button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 btn-ghost"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Goals;
