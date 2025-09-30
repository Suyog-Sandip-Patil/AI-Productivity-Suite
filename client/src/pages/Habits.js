import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  Flame, 
  Award,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Save,
  X,
  Clock
} from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    icon: '⭐',
    color: 'from-blue-500 to-purple-500',
    targetDays: 30,
    frequency: 'daily',
    reminderTime: '09:00',
    category: 'health'
  });

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('mindful-day-habits');
    if (savedHabits) {
      try {
        const parsedHabits = JSON.parse(savedHabits);
        setHabits(parsedHabits.map(habit => ({
          ...habit,
          completions: habit.completions || {},
          createdAt: new Date(habit.createdAt)
        })));
      } catch (error) {
        console.error('Error loading habits:', error);
        setHabits(getDefaultHabits());
      }
    } else {
      setHabits(getDefaultHabits());
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('mindful-day-habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Default habits for new users
  const getDefaultHabits = () => [
    {
      id: 1,
      name: 'Morning Meditation',
      description: '10 minutes of mindful meditation',
      icon: '🧘‍♀️',
      color: 'from-purple-500 to-indigo-500',
      streak: 0,
      completions: {},
      targetDays: 30,
      frequency: 'daily',
      reminderTime: '07:00',
      category: 'mindfulness',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Drink Water',
      description: '8 glasses throughout the day',
      icon: '💧',
      color: 'from-blue-500 to-cyan-500',
      streak: 0,
      completions: {},
      targetDays: 21,
      frequency: 'daily',
      reminderTime: '08:00',
      category: 'health',
      createdAt: new Date()
    }
  ];

  const toggleHabitCompletion = (habitId, date) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        newCompletions[date] = !newCompletions[date];
        
        // Recalculate streak
        let streak = 0;
        for (let i = 0; i < 30; i++) {
          const checkDate = format(addDays(new Date(), -i), 'yyyy-MM-dd');
          if (newCompletions[checkDate]) {
            streak++;
          } else {
            break;
          }
        }
        
        return { ...habit, completions: newCompletions, streak };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit = {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      completions: {},
      createdAt: new Date()
    };
    
    setHabits(prev => [...prev, habit]);
    resetNewHabit();
    setShowAddModal(false);
  };

  const updateHabit = (habitId, updatedData) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updatedData } : habit
    ));
    setEditingHabit(null);
  };

  const deleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
    }
  };

  const resetNewHabit = () => {
    setNewHabit({
      name: '',
      description: '',
      icon: '⭐',
      color: 'from-blue-500 to-purple-500',
      targetDays: 30,
      frequency: 'daily',
      reminderTime: '09:00',
      category: 'health'
    });
  };

  const startEditing = (habit) => {
    setEditingHabit({ ...habit });
  };

  const cancelEditing = () => {
    setEditingHabit(null);
  };

  const saveEdit = () => {
    if (editingHabit && editingHabit.name.trim()) {
      updateHabit(editingHabit.id, editingHabit);
    }
  };

  const calculateCompletionRate = (habit) => {
    const completions = Object.values(habit.completions).filter(Boolean).length;
    const totalDays = Math.max(1, Object.keys(habit.completions).length);
    return Math.round((completions / totalDays) * 100);
  };

  const getWeekDates = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates();
  const today = format(new Date(), 'yyyy-MM-dd');

  const HabitCard = ({ habit, index }) => {
    const isEditing = editingHabit && editingHabit.id === habit.id;
    const completionRate = calculateCompletionRate(habit);
    const daysRemaining = Math.max(0, habit.targetDays - habit.streak);

    return (
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Edit Habit
              </h3>
              <div className="flex space-x-2">
                <motion.button
                  onClick={saveEdit}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={cancelEditing}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter habit name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <select
                  value={editingHabit.icon}
                  onChange={(e) => setEditingHabit(prev => ({ ...prev, icon: e.target.value }))}
                  className="input-field"
                >
                  <option value="🧘‍♀️">🧘‍♀️ Meditation</option>
                  <option value="💧">💧 Water</option>
                  <option value="📝">📝 Journal</option>
                  <option value="🏃‍♂️">🏃‍♂️ Exercise</option>
                  <option value="📚">📚 Reading</option>
                  <option value="🥗">🥗 Healthy Eating</option>
                  <option value="😴">😴 Sleep</option>
                  <option value="🎯">🎯 Goals</option>
                  <option value="⭐">⭐ Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Days
                </label>
                <input
                  type="number"
                  value={editingHabit.targetDays}
                  onChange={(e) => setEditingHabit(prev => ({ ...prev, targetDays: parseInt(e.target.value) }))}
                  className="input-field"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={editingHabit.frequency}
                  onChange={(e) => setEditingHabit(prev => ({ ...prev, frequency: e.target.value }))}
                  className="input-field"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingHabit.description}
                  onChange={(e) => setEditingHabit(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field resize-none"
                  rows="2"
                  placeholder="Describe your habit..."
                />
              </div>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${habit.color} flex items-center justify-center text-2xl`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {habit.icon}
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {habit.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {habit.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => startEditing(habit)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Streak Info */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {habit.streak}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Current Streak</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {habit.targetDays}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Target Days</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {completionRate}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {habit.streak}/{habit.targetDays} days
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${habit.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((habit.streak / habit.targetDays) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Week Progress */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week</h4>
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, i) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isCompleted = habit.completions[dateStr];
                  const isToday = dateStr === today;
                  
                  return (
                    <motion.button
                      key={dateStr}
                      onClick={() => toggleHabitCompletion(habit.id, dateStr)}
                      className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center text-xs
                        ${isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isToday 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-2 border-blue-500'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                        transition-all duration-200
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="font-medium">{format(date, 'EEE')[0]}</span>
                      <span>{format(date, 'd')}</span>
                      {isCompleted && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Days Remaining */}
            {daysRemaining > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {daysRemaining} days remaining to reach your goal!
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
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
              <Target className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Habit Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build positive habits and track your progress over time
          </p>
        </motion.div>

        {/* Add Habit Button */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Habit</span>
          </motion.button>
        </motion.div>

        {/* Habits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {habits.map((habit, index) => (
              <HabitCard key={habit.id} habit={habit} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Add Habit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Add New Habit
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Habit Name
                    </label>
                    <input
                      type="text"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="Enter habit name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Icon
                      </label>
                      <select
                        value={newHabit.icon}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                        className="input-field"
                      >
                        <option value="🧘‍♀️">🧘‍♀️ Meditation</option>
                        <option value="💧">💧 Water</option>
                        <option value="📝">📝 Journal</option>
                        <option value="🏃‍♂️">🏃‍♂️ Exercise</option>
                        <option value="📚">📚 Reading</option>
                        <option value="🥗">🥗 Healthy Eating</option>
                        <option value="😴">😴 Sleep</option>
                        <option value="🎯">🎯 Goals</option>
                        <option value="⭐">⭐ Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Days
                      </label>
                      <input
                        type="number"
                        value={newHabit.targetDays}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, targetDays: parseInt(e.target.value) }))}
                        className="input-field"
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newHabit.description}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Describe your habit..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    onClick={addHabit}
                    className="btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Habit
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setShowAddModal(false);
                      resetNewHabit();
                    }}
                    className="btn-secondary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Habits;
