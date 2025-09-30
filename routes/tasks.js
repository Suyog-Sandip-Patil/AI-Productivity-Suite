const express = require('express');
const { 
  createTask, 
  getTasksByUserId, 
  updateTask, 
  deleteTask 
} = require('../utils/dataManager');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/tasks - Fetch all tasks for logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await getTasksByUserId(req.user.id);
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// POST /api/tasks - Add new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', completed = false } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high' });
    }

    const taskData = {
      title,
      description: description || '',
      priority,
      completed: Boolean(completed),
      userId: req.user.id
    };

    const newTask = await createTask(taskData);
    res.status(201).json({ 
      message: 'Task created successfully', 
      task: newTask 
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, completed } = req.body;

    // Validation
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high' });
    }

    // Get current task to verify ownership
    const userTasks = await getTasksByUserId(req.user.id);
    const existingTask = userTasks.find(task => task.id === id);
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    // Prepare updates
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (completed !== undefined) updates.completed = Boolean(completed);

    const updatedTask = await updateTask(id, updates);
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ 
      message: 'Task updated successfully', 
      task: updatedTask 
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify task ownership
    const userTasks = await getTasksByUserId(req.user.id);
    const existingTask = userTasks.find(task => task.id === id);
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    const deleted = await deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

module.exports = router;
