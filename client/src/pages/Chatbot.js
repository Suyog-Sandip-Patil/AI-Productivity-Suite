import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  MessageCircle,
  Zap,
  Heart,
  Brain,
  Target,
  Smile,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.name || 'there'}! 👋 I'm your AI assistant from AI Productivity Suite. I'm here to help you with wellness tips, productivity advice, mood support, and answer any questions about living mindfully. You can type or use voice commands! How can I assist you today?`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Voice synthesis function
  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Try to get a more natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.includes('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  // Toggle voice output
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Gather all user data for context
  const getUserContext = () => {
    try {
      const profile = JSON.parse(localStorage.getItem('mindful-day-profile') || '{}');
      const tasks = JSON.parse(localStorage.getItem('mindful-day-tasks') || '[]');
      const moods = JSON.parse(localStorage.getItem('mindful-day-moods') || '[]');
      const habits = JSON.parse(localStorage.getItem('mindful-day-habits') || '[]');
      const goals = JSON.parse(localStorage.getItem('mindful-day-goals') || '[]');
      const settings = JSON.parse(localStorage.getItem('mindful-day-settings') || '{}');

      // Get recent data (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentTasks = tasks.filter(task => 
        new Date(task.createdAt || task.timestamp) >= sevenDaysAgo
      );
      
      const recentMoods = moods.filter(mood => 
        new Date(mood.date || mood.timestamp) >= sevenDaysAgo
      );

      // Calculate statistics
      const completedTasks = tasks.filter(task => task.completed).length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const avgMood = recentMoods.length > 0 
        ? Math.round(recentMoods.reduce((sum, mood) => sum + (mood.rating || mood.value || 5), 0) / recentMoods.length * 10) / 10
        : null;

      const activeHabits = habits.filter(habit => habit.active !== false).length;
      const activeGoals = goals.filter(goal => !goal.completed).length;

      return {
        profile: {
          name: profile.name || user?.name || 'User',
          bio: profile.bio || ''
        },
        statistics: {
          totalTasks,
          completedTasks,
          completionRate,
          avgMood,
          activeHabits,
          activeGoals,
          recentTasksCount: recentTasks.length,
          recentMoodsCount: recentMoods.length
        },
        recentTasks: recentTasks.slice(0, 5).map(task => ({
          title: task.title || task.text,
          priority: task.priority,
          completed: task.completed,
          category: task.category
        })),
        recentMoods: recentMoods.slice(0, 5).map(mood => ({
          rating: mood.rating || mood.value,
          notes: mood.notes || mood.description,
          date: mood.date || mood.timestamp
        })),
        currentHabits: habits.slice(0, 3).map(habit => ({
          name: habit.name || habit.title,
          streak: habit.streak || 0,
          active: habit.active !== false
        })),
        currentGoals: goals.filter(goal => !goal.completed).slice(0, 3).map(goal => ({
          title: goal.title || goal.name,
          progress: goal.progress || 0,
          target: goal.target,
          category: goal.category
        })),
        preferences: {
          notifications: settings.notifications || {},
          privacy: settings.privacy || {}
        }
      };
    } catch (error) {
      console.error('Error gathering user context:', error);
      return {
        profile: { name: user?.name || 'User', bio: '' },
        statistics: {},
        recentTasks: [],
        recentMoods: [],
        currentHabits: [],
        currentGoals: [],
        preferences: {}
      };
    }
  };

  // AI API Integration using free services
  const getAIResponse = async (message) => {
    try {
      // Get AI settings from localStorage
      const savedAiSettings = localStorage.getItem('mindful-day-ai-settings');
      let aiSettings = null;
      
      if (savedAiSettings) {
        try {
          aiSettings = JSON.parse(savedAiSettings);
        } catch (error) {
          console.error('Error parsing AI settings:', error);
        }
      }

      // Gather comprehensive user context
      const userContext = getUserContext();
      
      // Option 1: Use our backend endpoint with API key if available
      const requestBody = {
        message: message,
        context: 'wellness_assistant',
        userContext: userContext
      };

      // Add API key and provider if available
      if (aiSettings && aiSettings.apiKey && aiSettings.provider !== 'local') {
        requestBody.apiKey = aiSettings.apiKey;
        requestBody.provider = aiSettings.provider;
      }

      const backendResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return data.response || getIntelligentResponse(message);
      }

      // Option 2: Use free public AI API (no auth required)
      const publicResponse = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-light',
          prompt: `You are a caring wellness assistant focused on mindfulness, productivity, and mental health. Respond helpfully and supportively to: "${message}"`,
          max_tokens: 150,
          temperature: 0.7,
        })
      });

      if (publicResponse.ok) {
        const data = await publicResponse.json();
        return data.generations?.[0]?.text?.trim() || getFallbackResponse(message);
      }

      // Option 3: Use OpenAI-compatible free endpoint
      const freeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-key' // Some services accept demo keys
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a caring wellness assistant focused on mindfulness, productivity, and mental health. Provide helpful, supportive responses.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (freeResponse.ok) {
        const data = await freeResponse.json();
        return data.choices?.[0]?.message?.content || getFallbackResponse(message);
      }

      // Fallback to intelligent response generation
      return getIntelligentResponse(message);
      
    } catch (error) {
      console.error('AI API Error:', error);
      return getIntelligentResponse(message);
    }
  };

  // Enhanced intelligent response system
  const getIntelligentResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Advanced keyword matching with context
    const keywords = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      mood: ['mood', 'feeling', 'emotion', 'sad', 'happy', 'angry', 'anxious', 'depressed'],
      stress: ['stress', 'stressed', 'overwhelmed', 'pressure', 'tension', 'worried', 'panic'],
      motivation: ['motivate', 'inspire', 'encourage', 'lazy', 'unmotivated', 'give up'],
      productivity: ['productive', 'work', 'focus', 'concentrate', 'distracted', 'procrastinate'],
      sleep: ['sleep', 'tired', 'insomnia', 'rest', 'exhausted', 'wake up'],
      exercise: ['exercise', 'workout', 'fitness', 'gym', 'run', 'walk'],
      meditation: ['meditate', 'mindful', 'breathe', 'calm', 'peace', 'zen'],
      goals: ['goal', 'achieve', 'success', 'dream', 'ambition', 'target'],
      relationships: ['relationship', 'friend', 'family', 'love', 'lonely', 'social'],
      health: ['health', 'healthy', 'diet', 'nutrition', 'sick', 'wellness'],
      time: ['time', 'schedule', 'busy', 'manage', 'organize', 'plan']
    };

    // Find matching categories
    const matches = [];
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerMessage.includes(word))) {
        matches.push(category);
      }
    }

    // Generate contextual response based on matches
    if (matches.includes('greeting')) {
      return generateGreetingResponse(message);
    } else if (matches.includes('mood')) {
      return generateMoodResponse(message, lowerMessage);
    } else if (matches.includes('stress')) {
      return generateStressResponse(message, lowerMessage);
    } else if (matches.includes('motivation')) {
      return generateMotivationResponse(message, lowerMessage);
    } else if (matches.includes('productivity')) {
      return generateProductivityResponse(message, lowerMessage);
    } else if (matches.includes('sleep')) {
      return generateSleepResponse(message, lowerMessage);
    } else if (matches.includes('exercise')) {
      return generateExerciseResponse(message, lowerMessage);
    } else if (matches.includes('meditation')) {
      return generateMeditationResponse(message, lowerMessage);
    } else if (matches.includes('goals')) {
      return generateGoalsResponse(message, lowerMessage);
    } else if (matches.includes('relationships')) {
      return generateRelationshipResponse(message, lowerMessage);
    } else if (matches.includes('health')) {
      return generateHealthResponse(message, lowerMessage);
    } else if (matches.includes('time')) {
      return generateTimeResponse(message, lowerMessage);
    } else {
      return generateGeneralResponse(message);
    }
  };

  // Response generators for different categories
  const generateGreetingResponse = (message) => {
    const responses = [
      "Hello! I'm so glad you're here. How are you feeling today? 😊",
      "Hi there! Ready to make today more mindful? What's on your mind? 🌟",
      "Welcome! I'm here to support your wellness journey. How can I help? 💫"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateMoodResponse = (message, lowerMessage) => {
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I hear that you're going through a difficult time. It's okay to feel sad - these emotions are valid and temporary. Would you like to try a quick breathing exercise or talk about what's troubling you? Remember, you're not alone. 💙";
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return "Anxiety can feel overwhelming, but you have the strength to work through this. Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. What specific situation is causing you anxiety? 🌸";
    } else if (lowerMessage.includes('happy')) {
      return "I'm so glad to hear you're feeling happy! It's wonderful when we can appreciate these positive moments. What's bringing you joy today? Let's celebrate it! ✨";
    } else {
      return "Thank you for checking in with your emotions. Mood awareness is such an important part of mindful living. Whether you're feeling great or struggling, I'm here to listen. What's your emotional weather like today? 🌈";
    }
  };

  const generateStressResponse = (message, lowerMessage) => {
    const stressTips = [
      "Take 5 deep breaths with me right now. In through your nose, out through your mouth. You've got this! 🌸",
      "Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This helps bring you back to the present moment. 🧘‍♀️",
      "Remember, stress is temporary but your resilience is permanent. What's one small thing you can do right now to feel a bit better? 💪"
    ];
    return stressTips[Math.floor(Math.random() * stressTips.length)];
  };

  const generateMotivationResponse = (message, lowerMessage) => {
    const motivationTips = [
      "You're already taking steps toward a better you by being here! Every small action counts. What's one tiny thing you can do today to move closer to your goals? ⭐",
      "Motivation comes and goes, but habits create lasting change. Focus on progress, not perfection. What positive habit would you like to build? 🌱",
      "You have everything within you to achieve your dreams. Sometimes we just need to start with one small step. What's calling to your heart today? 💖"
    ];
    return motivationTips[Math.floor(Math.random() * motivationTips.length)];
  };

  const generateProductivityResponse = (message, lowerMessage) => {
    if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate')) {
      return "Focus can be challenging in our distracted world. Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break. Also, consider what might be distracting you - is it your environment, your energy, or your mindset? 🎯";
    } else if (lowerMessage.includes('procrastinate')) {
      return "Procrastination often comes from feeling overwhelmed or perfectionism. Try breaking your task into smaller, 2-minute actions. What's the smallest step you can take right now? Remember, done is better than perfect! ✅";
    } else {
      return "Productivity isn't about doing more - it's about doing what matters most. Try prioritizing your top 3 tasks for today. What's the most important thing you need to accomplish? 📋";
    }
  };

  const generateSleepResponse = (message, lowerMessage) => {
    return "Good sleep is foundational to wellness! Try creating a bedtime routine: dim lights 1 hour before bed, avoid screens, try some gentle stretching or reading. What's your current sleep challenge? 😴";
  };

  const generateExerciseResponse = (message, lowerMessage) => {
    return "Movement is medicine for both body and mind! Even a 10-minute walk can boost your mood and energy. What type of movement feels good to you today? Remember, any movement counts! 🏃‍♀️";
  };

  const generateMeditationResponse = (message, lowerMessage) => {
    return "Mindfulness is about being present in this moment. Try this: Take three deep breaths and notice what you can hear, see, and feel right now. Even 2 minutes of mindfulness can make a difference. 🧘";
  };

  const generateGoalsResponse = (message, lowerMessage) => {
    return "Goals give us direction and purpose! The best goals are specific, meaningful, and aligned with your values. Try breaking your big goal into smaller milestones. What's your next small step? 🎯";
  };

  const generateRelationshipResponse = (message, lowerMessage) => {
    return "Relationships are so important for our wellbeing. Whether you're feeling connected or lonely, remember that quality matters more than quantity. How can you nurture one meaningful connection today? 💝";
  };

  const generateHealthResponse = (message, lowerMessage) => {
    return "Your health is your wealth! Small daily choices add up to big changes. Focus on one healthy habit at a time - maybe drinking more water, eating more vegetables, or taking a daily walk. What feels manageable for you? 🌿";
  };

  const generateTimeResponse = (message, lowerMessage) => {
    return "Time management is really energy management. Try time-blocking your day and remember to schedule breaks too! What's your biggest time challenge right now? Let's work on it together. ⏰";
  };

  const generateGeneralResponse = (message) => {
    const responses = [
      `That's a thoughtful question about "${message}". While I may not have all the answers, I'm here to support your journey toward mindful living. Could you tell me more about what you're looking for? 🤔`,
      `I appreciate you sharing "${message}" with me. Every question is an opportunity to learn and grow. How can I best support you in this moment? 💭`,
      `Thank you for trusting me with your thoughts about "${message}". Remember, you have wisdom within you too. What does your intuition tell you about this? 🌟`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Fallback responses for when AI API is unavailable
  const responses = {
    greeting: [
      "Hello! I'm so glad you're here. How are you feeling today? 😊",
      "Hi there! Ready to make today more mindful? What's on your mind? 🌟",
      "Welcome! I'm here to support your wellness journey. How can I help? 💫"
    ],
    mood: [
      "It's wonderful that you're checking in with your emotions! Remember, all feelings are valid. Would you like to log your mood or talk about what you're experiencing? 💝",
      "Mood awareness is such an important part of mindful living. Whether you're feeling great or struggling, I'm here to listen. What's your emotional weather like today? 🌈",
      "Thank you for being mindful of your emotions. Remember, it's okay to feel whatever you're feeling. Would you like some tips for emotional wellness? 🧘‍♀️"
    ],
    tasks: [
      "Great question about productivity! Remember, the key to effective task management is prioritizing what truly matters. Would you like tips on organizing your tasks or staying motivated? ✅",
      "Task management is all about finding your rhythm. Try breaking big tasks into smaller, manageable steps. What specific challenge are you facing with your tasks? 📋",
      "Productivity isn't about doing more - it's about doing what matters most. Would you like strategies for better focus or time management? 🎯"
    ],
    stress: [
      "I hear you, and I want you to know that feeling stressed is completely normal. Let's work through this together. Try taking three deep breaths with me right now. What's causing you the most stress today? 🌸",
      "Stress can feel overwhelming, but you have the strength to handle this. Some quick stress-relief techniques: deep breathing, a short walk, or listening to calming music. What usually helps you feel calmer? 🕊️",
      "Remember, stress is temporary, but your resilience is permanent. Would you like some mindfulness techniques or should we talk about what's on your mind? 💪"
    ],
    motivation: [
      "You're already taking steps toward a better you by being here! Every small action counts. What's one tiny thing you can do today to move closer to your goals? ⭐",
      "Motivation comes and goes, but habits create lasting change. Focus on progress, not perfection. What positive habit would you like to build? 🌱",
      "You have everything within you to achieve your dreams. Sometimes we just need to start with one small step. What's calling to your heart today? 💖"
    ],
    mindfulness: [
      "Mindfulness is about being present in this moment, right here, right now. Even taking a moment to notice your breath is a beautiful act of mindfulness. How are you practicing presence today? 🧘",
      "The present moment is the only moment we truly have. Mindfulness helps us appreciate life's simple joys. Would you like a quick mindfulness exercise? ✨",
      "Mindfulness isn't about emptying your mind - it's about observing your thoughts with kindness. What brings you into the present moment? 🌺"
    ],
    goals: [
      "Goals give us direction and purpose! The best goals are specific, meaningful, and aligned with your values. What dream are you working toward? 🎯",
      "Remember, every expert was once a beginner. Break your big goals into smaller milestones and celebrate each victory along the way. What's your next milestone? 🏆",
      "Goals are dreams with deadlines. But be gentle with yourself - progress isn't always linear. What matters most to you right now? 💫"
    ],
    gratitude: [
      "Gratitude is like sunshine for the soul! It shifts our focus from what's missing to what's abundant in our lives. What are you grateful for today? 🌞",
      "Practicing gratitude literally rewires our brain for happiness. Even in difficult times, there are small blessings to notice. What made you smile recently? 😊",
      "Gratitude turns what we have into enough. It's one of the most powerful practices for well-being. Would you like to share something you're thankful for? 🙏"
    ],
    default: [
      "That's a thoughtful question! While I may not have all the answers, I'm here to support your journey toward mindful living. Could you tell me more about what you're looking for? 🤔",
      "I appreciate you sharing that with me. Every question is an opportunity to learn and grow. How can I best support you in this moment? 💭",
      "Thank you for trusting me with your thoughts. Remember, you have wisdom within you too. What does your intuition tell you about this? 🌟"
    ]
  };

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    if (lowerMessage.includes('mood') || lowerMessage.includes('feeling') || lowerMessage.includes('emotion')) {
      return responses.mood[Math.floor(Math.random() * responses.mood.length)];
    }
    if (lowerMessage.includes('task') || lowerMessage.includes('productivity') || lowerMessage.includes('work')) {
      return responses.tasks[Math.floor(Math.random() * responses.tasks.length)];
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return responses.stress[Math.floor(Math.random() * responses.stress.length)];
    }
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('encourage')) {
      return responses.motivation[Math.floor(Math.random() * responses.motivation.length)];
    }
    if (lowerMessage.includes('mindful') || lowerMessage.includes('meditat') || lowerMessage.includes('present')) {
      return responses.mindfulness[Math.floor(Math.random() * responses.mindfulness.length)];
    }
    if (lowerMessage.includes('goal') || lowerMessage.includes('dream') || lowerMessage.includes('achieve')) {
      return responses.goals[Math.floor(Math.random() * responses.goals.length)];
    }
    if (lowerMessage.includes('grateful') || lowerMessage.includes('thankful') || lowerMessage.includes('appreciate')) {
      return responses.gratitude[Math.floor(Math.random() * responses.gratitude.length)];
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Try AI API first, fallback to predefined responses
      const responseText = await getAIResponse(currentMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        setTimeout(() => speakText(responseText), 500);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      const fallbackResponse = {
        id: Date.now() + 1,
        text: getFallbackResponse(currentMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
      
      // Speak the fallback response if voice is enabled
      if (voiceEnabled) {
        setTimeout(() => speakText(fallbackResponse.text), 500);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const MessageBubble = ({ message, index }) => (
    <motion.div
      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.isBot 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {message.isBot ? (
            <Bot className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </motion.div>
        
        <motion.div
          className={`px-4 py-3 rounded-2xl ${
            message.isBot
              ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-1 ${
            message.isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
          }`}>
            {message.timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  const TypingIndicator = () => (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-end space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const quickActions = [
    { text: "How can I reduce stress?", icon: Heart },
    { text: "Tips for better productivity", icon: Brain },
    { text: "I'm feeling overwhelmed", icon: Smile },
    { text: "Help me stay motivated", icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Mindful Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI companion for wellness, productivity, and mindful living
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          className="card h-96 flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={index} />
              ))}
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Voice Controls */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <motion.button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isTyping}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </motion.button>
                
                {isListening && (
                  <motion.div
                    className="flex items-center space-x-2 text-red-500"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Listening...</span>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    voiceEnabled 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={voiceEnabled ? 'Voice output enabled' : 'Voice output disabled'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </motion.button>

                {isSpeaking && (
                  <motion.button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Stop speaking"
                  >
                    <Pause className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Listening for your voice..." : "Type or speak your message..."}
                className="flex-1 input-field"
                disabled={isTyping || isListening}
              />
              <motion.button
                type="submit"
                className="btn-primary px-4 py-2 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTyping || !inputMessage.trim() || isListening}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Quick Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => setInputMessage(action.text)}
                  className="card p-4 text-left hover:shadow-lg transition-all duration-300 flex items-center space-x-3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {action.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Wellness Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Mindful Guidance</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
