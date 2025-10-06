const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const moodRoutes = require('./routes/moods');
const quoteRoutes = require('./routes/quotes');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/users', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/quotes', quoteRoutes);

// Serve static files from React build (only for non-Vercel deployments)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Root API endpoint for testing
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Mindful Day API is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, apiKey, provider, userContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let aiResponse = null;

    // Try to use provided API key and provider first
    if (apiKey && provider) {
      try {
        aiResponse = await getAIResponseWithKey(message, apiKey, provider, userContext);
      } catch (error) {
        console.error('API key service error:', error);
        // Fall back to intelligent response system
        aiResponse = generateIntelligentChatResponse(message, context, userContext);
      }
    } else {
      // Use intelligent response system as fallback
      aiResponse = generateIntelligentChatResponse(message, context, userContext);
    }

    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: apiKey ? provider : 'intelligent_fallback'
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment. 😔"
    });
  }
});

// Function to get AI response using provided API key
async function getAIResponseWithKey(message, apiKey, provider, userContext) {
  // Create personalized system prompt with user context
  const contextPrompt = createPersonalizedPrompt(userContext);
  const fullPrompt = `${contextPrompt}\n\nUser question: "${message}"`;

  switch (provider) {
    case 'openai':
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a caring AI assistant for a productivity and wellness app called "AI Productivity Suite". You have access to the user's personal data and should provide personalized, helpful responses based on their current situation. Always be supportive, encouraging, and reference their specific data when relevant.`
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (openaiResponse.ok) {
        const data = await openaiResponse.json();
        return data.choices?.[0]?.message?.content || generateFallbackResponse(message);
      }
      break;

    case 'anthropic':
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: fullPrompt
            }
          ]
        })
      });

      if (anthropicResponse.ok) {
        const data = await anthropicResponse.json();
        return data.content?.[0]?.text || generateFallbackResponse(message);
      }
      break;

    case 'groq':
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a caring AI assistant for a productivity and wellness app called "AI Productivity Suite". You have access to the user\'s personal data and should provide personalized, helpful responses based on their current situation. Always be supportive, encouraging, and reference their specific data when relevant.'
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        return data.choices?.[0]?.message?.content || generateFallbackResponse(message);
      }
      break;

    default:
      throw new Error('Unsupported provider');
  }

  throw new Error('API request failed');
}

// Create personalized prompt with user context
function createPersonalizedPrompt(userContext) {
  if (!userContext) return '';

  const { profile, statistics, recentTasks, recentMoods, currentHabits, currentGoals } = userContext;
  
  let prompt = `User Profile:
- Name: ${profile?.name || 'User'}
- Bio: ${profile?.bio || 'No bio provided'}

Current Statistics:
- Total Tasks: ${statistics?.totalTasks || 0}
- Completed Tasks: ${statistics?.completedTasks || 0}
- Task Completion Rate: ${statistics?.completionRate || 0}%
- Average Recent Mood: ${statistics?.avgMood ? `${statistics.avgMood}/10` : 'No recent mood data'}
- Active Habits: ${statistics?.activeHabits || 0}
- Active Goals: ${statistics?.activeGoals || 0}`;

  if (recentTasks && recentTasks.length > 0) {
    prompt += `\n\nRecent Tasks:`;
    recentTasks.forEach((task, index) => {
      prompt += `\n${index + 1}. ${task.title} (${task.priority} priority, ${task.completed ? 'completed' : 'pending'})`;
    });
  }

  if (recentMoods && recentMoods.length > 0) {
    prompt += `\n\nRecent Mood Entries:`;
    recentMoods.forEach((mood, index) => {
      prompt += `\n${index + 1}. Rating: ${mood.rating}/10${mood.notes ? `, Notes: ${mood.notes}` : ''}`;
    });
  }

  if (currentHabits && currentHabits.length > 0) {
    prompt += `\n\nCurrent Habits:`;
    currentHabits.forEach((habit, index) => {
      prompt += `\n${index + 1}. ${habit.name} (${habit.streak} day streak, ${habit.active ? 'active' : 'inactive'})`;
    });
  }

  if (currentGoals && currentGoals.length > 0) {
    prompt += `\n\nCurrent Goals:`;
    currentGoals.forEach((goal, index) => {
      prompt += `\n${index + 1}. ${goal.title} (${goal.progress || 0}% progress)`;
    });
  }

  return prompt;
}

// Generate personalized responses based on user data
function generatePersonalizedResponse(message, userContext) {
  const lowerMessage = message.toLowerCase();
  const { profile, statistics, recentTasks, recentMoods, currentHabits, currentGoals } = userContext;

  // Personal data queries
  if (lowerMessage.includes('my tasks') || lowerMessage.includes('my task')) {
    if (recentTasks && recentTasks.length > 0) {
      const pendingTasks = recentTasks.filter(task => !task.completed);
      const completedTasks = recentTasks.filter(task => task.completed);
      
      let response = `Hi ${profile?.name || 'there'}! Here's your task overview:\n\n`;
      
      if (pendingTasks.length > 0) {
        response += `📋 **Pending Tasks (${pendingTasks.length}):**\n`;
        pendingTasks.forEach((task, index) => {
          response += `${index + 1}. ${task.title} (${task.priority} priority)\n`;
        });
      }
      
      if (completedTasks.length > 0) {
        response += `\n✅ **Recently Completed (${completedTasks.length}):**\n`;
        completedTasks.forEach((task, index) => {
          response += `${index + 1}. ${task.title}\n`;
        });
      }
      
      response += `\nYour overall completion rate is ${statistics?.completionRate || 0}%! `;
      
      if (statistics?.completionRate >= 80) {
        response += "Excellent work! 🌟";
      } else if (statistics?.completionRate >= 60) {
        response += "You're doing great! Keep it up! 💪";
      } else {
        response += "Let's work on completing more tasks together! 🎯";
      }
      
      return response;
    } else {
      return `Hi ${profile?.name || 'there'}! You don't have any recent tasks. Would you like me to help you create some productive goals? 📝`;
    }
  }

  // Mood queries
  if (lowerMessage.includes('my mood') || lowerMessage.includes('how am i') || lowerMessage.includes('feeling')) {
    if (recentMoods && recentMoods.length > 0) {
      const latestMood = recentMoods[0];
      const avgMood = statistics?.avgMood;
      
      let response = `Based on your recent mood tracking:\n\n`;
      response += `📊 Your average mood this week: ${avgMood}/10\n`;
      response += `🎭 Latest entry: ${latestMood.rating}/10`;
      
      if (latestMood.notes) {
        response += ` - "${latestMood.notes}"`;
      }
      
      if (avgMood >= 7) {
        response += `\n\nYou're doing wonderfully! Your positive mood shows you're taking great care of yourself. 😊✨`;
      } else if (avgMood >= 5) {
        response += `\n\nYou're maintaining a balanced mood. Consider some self-care activities to boost your wellbeing! 🌱`;
      } else {
        response += `\n\nI notice you've been having some challenging days. Remember, it's okay to have ups and downs. Would you like some mood-boosting suggestions? 💙`;
      }
      
      return response;
    } else {
      return `I don't have recent mood data for you. Would you like to start tracking your mood? It's a great way to understand your emotional patterns! 😊`;
    }
  }

  // Habits queries
  if (lowerMessage.includes('my habits') || lowerMessage.includes('habit')) {
    if (currentHabits && currentHabits.length > 0) {
      let response = `Here are your current habits:\n\n`;
      
      currentHabits.forEach((habit, index) => {
        const streakEmoji = habit.streak >= 7 ? '🔥' : habit.streak >= 3 ? '⭐' : '🌱';
        response += `${streakEmoji} **${habit.name}** - ${habit.streak} day streak\n`;
      });
      
      const maxStreak = Math.max(...currentHabits.map(h => h.streak));
      if (maxStreak >= 7) {
        response += `\nAmazing! Your longest streak is ${maxStreak} days! You're building incredible consistency! 🏆`;
      } else {
        response += `\nKeep building those habits! Consistency is key to lasting change. 💪`;
      }
      
      return response;
    } else {
      return `You haven't set up any habits yet. Would you like help creating some positive daily habits? 🌟`;
    }
  }

  // Goals queries
  if (lowerMessage.includes('my goals') || lowerMessage.includes('goal')) {
    if (currentGoals && currentGoals.length > 0) {
      let response = `Here's your goal progress:\n\n`;
      
      currentGoals.forEach((goal, index) => {
        const progressEmoji = goal.progress >= 75 ? '🎯' : goal.progress >= 50 ? '📈' : goal.progress >= 25 ? '🌱' : '🎪';
        response += `${progressEmoji} **${goal.title}** - ${goal.progress || 0}% complete\n`;
      });
      
      const avgProgress = currentGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / currentGoals.length;
      
      if (avgProgress >= 75) {
        response += `\nYou're crushing your goals! Average progress: ${Math.round(avgProgress)}% 🚀`;
      } else if (avgProgress >= 50) {
        response += `\nSolid progress on your goals! Keep pushing forward! 💪`;
      } else {
        response += `\nEvery step counts toward your goals. What can I help you accomplish today? 🎯`;
      }
      
      return response;
    } else {
      return `You haven't set any goals yet. Let's create some meaningful goals together! What would you like to achieve? 🎯`;
    }
  }

  // Progress and statistics queries
  if (lowerMessage.includes('progress') || lowerMessage.includes('statistics') || lowerMessage.includes('stats')) {
    let response = `Here's your productivity overview:\n\n`;
    response += `📊 **Task Completion:** ${statistics?.completionRate || 0}% (${statistics?.completedTasks || 0}/${statistics?.totalTasks || 0})\n`;
    response += `🎭 **Average Mood:** ${statistics?.avgMood ? `${statistics.avgMood}/10` : 'No recent data'}\n`;
    response += `🔄 **Active Habits:** ${statistics?.activeHabits || 0}\n`;
    response += `🎯 **Active Goals:** ${statistics?.activeGoals || 0}\n`;
    
    const overallScore = calculateOverallScore(statistics);
    response += `\n🌟 **Overall Wellness Score:** ${overallScore}/100\n`;
    
    if (overallScore >= 80) {
      response += `\nExceptional! You're thriving in all areas! 🌟✨`;
    } else if (overallScore >= 60) {
      response += `\nGreat work! You're making solid progress across all areas! 💪`;
    } else {
      response += `\nYou're on the right path! Let's work together to boost your wellness journey! 🌱`;
    }
    
    return response;
  }

  return null; // No personalized response found
}

// Calculate overall wellness score
function calculateOverallScore(statistics) {
  if (!statistics) return 0;
  
  let score = 0;
  let factors = 0;
  
  if (statistics.completionRate !== undefined) {
    score += statistics.completionRate;
    factors++;
  }
  
  if (statistics.avgMood !== undefined) {
    score += (statistics.avgMood * 10);
    factors++;
  }
  
  if (statistics.activeHabits !== undefined) {
    score += Math.min(statistics.activeHabits * 20, 100);
    factors++;
  }
  
  if (statistics.activeGoals !== undefined) {
    score += Math.min(statistics.activeGoals * 25, 100);
    factors++;
  }
  
  return factors > 0 ? Math.round(score / factors) : 0;
}

// Intelligent chat response generator
function generateIntelligentChatResponse(message, context, userContext) {
  const lowerMessage = message.toLowerCase();
  
  // Check for personalized queries first
  if (userContext) {
    const personalizedResponse = generatePersonalizedResponse(message, userContext);
    if (personalizedResponse) return personalizedResponse;
  }
  
  // Advanced pattern matching for more natural responses
  const patterns = {
    questions: {
      what: ['what is', 'what are', 'what do', 'what should'],
      how: ['how to', 'how do', 'how can', 'how should'],
      why: ['why is', 'why do', 'why should', 'why does'],
      when: ['when should', 'when do', 'when is'],
      where: ['where can', 'where do', 'where should']
    },
    emotions: {
      positive: ['happy', 'excited', 'grateful', 'proud', 'confident', 'motivated'],
      negative: ['sad', 'angry', 'frustrated', 'disappointed', 'worried', 'anxious', 'stressed'],
      neutral: ['okay', 'fine', 'alright', 'normal', 'average']
    },
    wellness_topics: {
      mental_health: ['depression', 'anxiety', 'panic', 'therapy', 'counseling', 'mental health'],
      physical_health: ['exercise', 'diet', 'nutrition', 'sleep', 'fitness', 'workout'],
      productivity: ['focus', 'concentration', 'procrastination', 'time management', 'goals'],
      relationships: ['family', 'friends', 'partner', 'social', 'lonely', 'relationship'],
      mindfulness: ['meditation', 'mindful', 'breathing', 'present moment', 'awareness']
    }
  };

  // Detect question type
  let questionType = null;
  for (const [type, phrases] of Object.entries(patterns.questions)) {
    if (phrases.some(phrase => lowerMessage.includes(phrase))) {
      questionType = type;
      break;
    }
  }

  // Detect emotional state
  let emotionalState = 'neutral';
  for (const [state, words] of Object.entries(patterns.emotions)) {
    if (words.some(word => lowerMessage.includes(word))) {
      emotionalState = state;
      break;
    }
  }

  // Detect wellness topic
  let wellnessTopic = null;
  for (const [topic, keywords] of Object.entries(patterns.wellness_topics)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      wellnessTopic = topic;
      break;
    }
  }

  // Generate contextual response
  return generateContextualResponse(message, questionType, emotionalState, wellnessTopic);
}

function generateContextualResponse(message, questionType, emotionalState, wellnessTopic) {
  // Emotional responses
  if (emotionalState === 'negative') {
    const supportiveResponses = [
      "I can sense you're going through a challenging time. Your feelings are completely valid, and it's okay to not be okay sometimes. What's weighing on your heart right now? 💙",
      "Thank you for sharing how you're feeling with me. It takes courage to acknowledge difficult emotions. Remember, this feeling is temporary, and you have the strength to work through it. How can I support you? 🌸",
      "I hear the pain in your message, and I want you to know that you're not alone in this. Every emotion serves a purpose, even the difficult ones. Would you like to talk about what's causing these feelings? 💝"
    ];
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  }

  if (emotionalState === 'positive') {
    const celebratoryResponses = [
      "I love hearing the joy in your message! It's wonderful when we can appreciate these positive moments. What's bringing you happiness today? Let's celebrate it together! ✨",
      "Your positive energy is contagious! It's beautiful to see you embracing the good in your life. Gratitude and joy are such powerful forces for wellbeing. 🌟",
      "This is fantastic! I'm so glad you're experiencing these positive feelings. Remember to savor this moment - happiness is meant to be fully experienced. 😊"
    ];
    return celebratoryResponses[Math.floor(Math.random() * celebratoryResponses.length)];
  }

  // Topic-specific responses
  if (wellnessTopic === 'mental_health') {
    return "Mental health is just as important as physical health, and seeking support shows incredible strength. If you're struggling, please remember that professional help is available, and there's no shame in reaching out. In the meantime, small daily practices like mindfulness, gentle movement, and connecting with others can help. What feels most supportive for you right now? 🧠💚";
  }

  if (wellnessTopic === 'physical_health') {
    return "Taking care of your physical health is one of the best investments you can make! Small, consistent changes often work better than dramatic overhauls. Whether it's a 10-minute walk, drinking more water, or getting better sleep - every positive choice counts. What aspect of your physical health would you like to focus on? 🏃‍♀️💪";
  }

  if (wellnessTopic === 'productivity') {
    return "Productivity is really about aligning your energy with your priorities. Instead of trying to do everything, focus on what truly matters. Try the 'Rule of 3' - choose 3 important things to accomplish each day. Also, remember that rest and breaks are productive too! What's your biggest productivity challenge right now? 📈⚡";
  }

  if (wellnessTopic === 'relationships') {
    return "Relationships are the foundation of our wellbeing. Whether you're nurturing existing connections or building new ones, remember that quality matters more than quantity. Authentic connections require vulnerability, empathy, and patience - with others and yourself. How are you feeling about your relationships lately? 💕👥";
  }

  if (wellnessTopic === 'mindfulness') {
    return "Mindfulness is such a beautiful practice! It's about being fully present in this moment, without judgment. Even taking three conscious breaths can be a mindful act. The goal isn't to empty your mind, but to observe your thoughts and feelings with kindness. Would you like a simple mindfulness exercise to try? 🧘‍♀️✨";
  }

  // Question-specific responses
  if (questionType === 'how') {
    return `That's a great "how" question! The path to any meaningful change usually starts with small, consistent steps. For your question about "${message}", I'd suggest starting with the smallest possible action you can take today. What feels manageable and realistic for you right now? 🛤️`;
  }

  if (questionType === 'what') {
    return `Excellent question! When exploring "${message}", it often helps to consider both the practical and emotional aspects. What matters most to you in this situation? Understanding your values and priorities can guide you toward the right answer. 🤔💭`;
  }

  if (questionType === 'why') {
    return `"Why" questions often lead to the deepest insights! Your curiosity about "${message}" shows you're thinking deeply about this topic. Sometimes the answer lies in our personal experiences, values, or the meaning we create. What do you think might be driving this question for you? 🔍💡`;
  }

  // General intelligent response
  const generalResponses = [
    `I appreciate you sharing "${message}" with me. This sounds like something that's important to you. Every person's journey is unique, and what works for one person might not work for another. What aspects of this resonate most with your current situation? 🌱`,
    `Thank you for bringing up "${message}". This is the kind of thoughtful reflection that leads to real growth. Sometimes the best answers come from within us when we create space to listen. What does your intuition tell you about this? 💫`,
    `Your question about "${message}" shows real self-awareness. Growth often happens when we're curious about our experiences and willing to explore them. What would it look like if you approached this with compassion for yourself? 🌸`
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

function generateFallbackResponse(message) {
  const fallbacks = [
    "I'm here to listen and support you on your wellness journey. While I may not have all the answers, I believe in your ability to find your own path. What feels most important to you right now? 💙",
    "Thank you for sharing with me. Every conversation is an opportunity for growth and reflection. How can I best support you in this moment? 🌟",
    "I appreciate your openness in sharing this with me. Remember, you have wisdom within you too. What does your heart tell you about this situation? 💝"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mindful Day server running on port ${PORT}`);
  console.log(`🌟 Environment: ${process.env.NODE_ENV}`);
});
