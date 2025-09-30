const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

// Read data from JSON file
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    // Return default structure if file doesn't exist
    return {
      users: [],
      tasks: [],
      moods: [],
      quotes: []
    };
  }
};

// Write data to JSON file
const writeData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to save data');
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// User operations
const createUser = async (userData) => {
  const data = await readData();
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  data.users.push(newUser);
  await writeData(data);
  return newUser;
};

const findUserByEmail = async (email) => {
  const data = await readData();
  return data.users.find(user => user.email === email);
};

const findUserById = async (id) => {
  const data = await readData();
  return data.users.find(user => user.id === id);
};

// Task operations
const createTask = async (taskData) => {
  const data = await readData();
  const newTask = {
    id: generateId(),
    ...taskData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.tasks.push(newTask);
  await writeData(data);
  return newTask;
};

const getTasksByUserId = async (userId) => {
  const data = await readData();
  return data.tasks.filter(task => task.userId === userId);
};

const updateTask = async (taskId, updates) => {
  const data = await readData();
  const taskIndex = data.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return null;
  
  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await writeData(data);
  return data.tasks[taskIndex];
};

const deleteTask = async (taskId) => {
  const data = await readData();
  const taskIndex = data.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return false;
  
  data.tasks.splice(taskIndex, 1);
  await writeData(data);
  return true;
};

// Mood operations
const createMood = async (moodData) => {
  const data = await readData();
  const newMood = {
    id: generateId(),
    ...moodData,
    createdAt: new Date().toISOString()
  };
  data.moods.push(newMood);
  await writeData(data);
  return newMood;
};

const getMoodsByUserId = async (userId) => {
  const data = await readData();
  return data.moods.filter(mood => mood.userId === userId);
};

// Quote operations
const getAllQuotes = async () => {
  const data = await readData();
  return data.quotes;
};

const createQuote = async (quoteData) => {
  const data = await readData();
  const newQuote = {
    id: generateId(),
    ...quoteData,
    createdAt: new Date().toISOString()
  };
  data.quotes.push(newQuote);
  await writeData(data);
  return newQuote;
};

module.exports = {
  readData,
  writeData,
  generateId,
  createUser,
  findUserByEmail,
  findUserById,
  createTask,
  getTasksByUserId,
  updateTask,
  deleteTask,
  createMood,
  getMoodsByUserId,
  getAllQuotes,
  createQuote
};
