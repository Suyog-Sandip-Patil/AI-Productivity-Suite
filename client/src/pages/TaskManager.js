import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, filterPriority, filterStatus]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }

    setFilteredTasks(filtered);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks(prev => [response.data.task, ...prev]);
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowAddModal(false);
      toast.success('Task added successfully! 🎉');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.data.task : task
      ));
      
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? 'Task completed! 🎉' : 'Task reopened');
      } else {
        toast.success('Task updated successfully');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    try {
      const response = await axios.put(`/api/tasks/${editingTask.id}`, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority
      });
      
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? response.data.task : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle2;
      default: return Clock;
    }
  };

  const TaskCard = ({ task, index }) => {
    const PriorityIcon = getPriorityIcon(task.priority);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -100, scale: 0.8 }}
        transition={{ 
          duration: 0.3, 
          delay: index * 0.05,
          layout: { duration: 0.3 }
        }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`card p-6 cursor-pointer transition-all duration-300 ${
          task.completed ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <motion.button
              onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <div className="flex-1">
              <h3 className={`font-semibold text-lg transition-all duration-300 ${
                task.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-800 dark:text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 transition-all duration-300 ${
                  task.completed 
                    ? 'line-through text-gray-400 dark:text-gray-500' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white text-xs font-medium flex items-center space-x-1`}
              whileHover={{ scale: 1.05 }}
            >
              <PriorityIcon className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setEditingTask(task)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => handleDeleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
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
          <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
        </motion.div>
      </div>
    );
  }

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
              Task Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay organized and productive with your tasks
            </p>
          </div>

          <motion.button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input-field"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <motion.div
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {searchTerm || filterPriority !== 'all' || filterStatus !== 'all' 
                    ? 'No tasks match your filters' 
                    : 'No tasks yet'
                  }
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  {searchTerm || filterPriority !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first task to get started'
                  }
                </p>
                {!searchTerm && filterPriority === 'all' && filterStatus === 'all' && (
                  <motion.button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Your First Task
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add Task Modal */}
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
                className="card-glass max-w-md w-full p-6"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Add New Task
                </h2>

                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Enter task description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      className="flex-1 btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Task
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

        {/* Edit Task Modal */}
        <AnimatePresence>
          {editingTask && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTask(null)}
            >
              <motion.div
                className="card-glass max-w-md w-full p-6"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Edit Task
                </h2>

                <form onSubmit={handleEditTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Enter task description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="submit"
                      className="flex-1 btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Update Task
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setEditingTask(null)}
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

export default TaskManager;
