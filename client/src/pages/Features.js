import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Heart, 
  BarChart3, 
  Users, 
  MessageCircle,
  Settings,
  Target,
  Calendar,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Shield,
  Smartphone,
  Palette,
  Globe
} from 'lucide-react';

const Features = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);

  const features = [
    {
      id: 'tasks',
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Organize your life with intelligent task prioritization, animated cards, and real-time updates.',
      color: 'from-blue-500 to-cyan-500',
      demo: {
        type: 'task-animation',
        steps: [
          'Create tasks with different priorities',
          'Watch them animate beautifully',
          'Mark complete with satisfying effects',
          'Filter and search in real-time'
        ]
      },
      benefits: [
        'Priority-based organization',
        'Real-time search & filtering',
        'Animated feedback',
        'Progress tracking'
      ]
    },
    {
      id: 'mood',
      icon: Heart,
      title: 'Mood Journaling',
      description: 'Track your emotional well-being with emoji selection, mood ratings, and insightful analytics.',
      color: 'from-pink-500 to-rose-500',
      demo: {
        type: 'mood-animation',
        steps: [
          'Select mood with emoji morphing',
          'Rate on 1-10 scale with slider',
          'Add personal notes',
          'View mood history & trends'
        ]
      },
      benefits: [
        'Emoji-based mood selection',
        'Detailed mood analytics',
        'Personal journaling',
        'Pattern recognition'
      ]
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Gain insights into your productivity and wellness with beautiful charts and detailed reports.',
      color: 'from-purple-500 to-indigo-500',
      demo: {
        type: 'chart-animation',
        steps: [
          'View productivity trends',
          'Analyze mood patterns',
          'Track completion rates',
          'Get personalized insights'
        ]
      },
      benefits: [
        'Interactive charts',
        'Productivity scoring',
        'Trend analysis',
        'Actionable insights'
      ]
    },
    {
      id: 'community',
      icon: Users,
      title: 'Community Inspiration',
      description: 'Share and discover motivational quotes with a beautiful 3D carousel and community features.',
      color: 'from-green-500 to-teal-500',
      demo: {
        type: 'carousel-animation',
        steps: [
          'Browse inspiring quotes',
          'Experience 3D carousel',
          'Share your own quotes',
          'Connect with community'
        ]
      },
      benefits: [
        '3D animated carousel',
        'Community sharing',
        'Daily inspiration',
        'Quote collections'
      ]
    },
    {
      id: 'chatbot',
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Get personalized guidance with our intelligent chatbot for wellness, productivity, and mindfulness.',
      color: 'from-orange-500 to-red-500',
      demo: {
        type: 'chat-animation',
        steps: [
          'Ask wellness questions',
          'Get instant responses',
          'Receive personalized tips',
          'Access 24/7 support'
        ]
      },
      benefits: [
        'AI-powered responses',
        'Wellness expertise',
        'Instant availability',
        'Personalized guidance'
      ]
    },
    {
      id: 'design',
      icon: Palette,
      title: 'Beautiful Design',
      description: 'Enjoy a stunning UI with glassmorphism effects, smooth animations, and responsive design.',
      color: 'from-violet-500 to-purple-500',
      demo: {
        type: 'design-animation',
        steps: [
          'Glassmorphism effects',
          'Smooth animations',
          'Dark/light themes',
          'Mobile responsive'
        ]
      },
      benefits: [
        'Modern glassmorphism',
        'Framer Motion animations',
        'Theme switching',
        'Mobile optimized'
      ]
    }
  ];

  const techFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with instant updates and smooth animations'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with JWT authentication and secure storage'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Fully responsive design that works perfectly on all devices'
    },
    {
      icon: Globe,
      title: 'Always Available',
      description: 'Access your mindful journey anywhere, anytime with cloud sync'
    }
  ];

  const FeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;
    const isActive = activeDemo === feature.id;
    
    return (
      <motion.div
        className={`card p-6 cursor-pointer transition-all duration-300 ${
          isActive ? 'ring-2 ring-primary-500 shadow-xl' : ''
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={() => setActiveDemo(isActive ? null : feature.id)}
      >
        <div className="flex items-start space-x-4 mb-4">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {feature.benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isActive ? 'Hide Demo' : 'View Demo'}
        </motion.button>
      </motion.div>
    );
  };

  const DemoAnimation = ({ feature }) => {
    if (!feature) return null;

    const renderDemo = () => {
      switch (feature.demo.type) {
        case 'task-animation':
          return (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-500 rounded-full cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <span className="flex-1 text-gray-700 dark:text-gray-300">
                    Sample Task {i}
                  </span>
                  <motion.div
                    className={`px-2 py-1 rounded text-xs text-white ${
                      i === 1 ? 'bg-red-500' : i === 2 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {i === 1 ? 'High' : i === 2 ? 'Medium' : 'Low'}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          );

        case 'mood-animation':
          return (
            <div className="text-center space-y-6">
              <div className="flex justify-center space-x-4">
                {['😢', '😐', '😊', '😄', '🤩'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="text-3xl cursor-pointer"
                    whileHover={{ scale: 1.3, rotate: [0, -10, 10, -10, 0] }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              </motion.div>
            </div>
          );

        case 'chart-animation':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[60, 80, 45].map((height, i) => (
                  <div key={i} className="text-center">
                    <motion.div
                      className="bg-gradient-to-t from-primary-500 to-primary-300 rounded-t mx-auto mb-2"
                      style={{ width: '20px' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}px` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Day {i + 1}
                    </span>
                  </div>
                ))}
              </div>
              <motion.div
                className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  Productivity Score: 75%
                </span>
              </motion.div>
            </div>
          );

        case 'carousel-animation':
          return (
            <div className="relative h-32 overflow-hidden rounded-lg">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-medium"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ 
                    rotateY: i === 1 ? 0 : 90,
                    opacity: i === 1 ? 1 : 0,
                    z: i === 1 ? 10 : 0
                  }}
                  transition={{ 
                    duration: 1, 
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  "Inspirational Quote {i + 1}"
                </motion.div>
              ))}
            </div>
          );

        case 'chat-animation':
          return (
            <div className="space-y-3">
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-primary-500 text-white p-2 rounded-lg text-sm max-w-xs">
                  How can I reduce stress?
                </div>
              </motion.div>
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-lg text-sm max-w-xs">
                  Try deep breathing exercises and mindful meditation! 🧘‍♀️
                </div>
              </motion.div>
            </div>
          );

        case 'design-animation':
          return (
            <div className="space-y-4">
              <motion.div
                className="glass p-4 rounded-xl"
                animate={{ 
                  background: [
                    'rgba(255, 255, 255, 0.1)',
                    'rgba(255, 255, 255, 0.2)',
                    'rgba(255, 255, 255, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-1" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              </motion.div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Glassmorphism + Smooth Animations
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <motion.div
        className="card p-6 mt-6"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {feature.title} Demo
          </h3>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setAutoPlay(!autoPlay)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
            <motion.button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        <div className="mb-4">
          {renderDemo()}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
            Demo Steps:
          </h4>
          {feature.demo.steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              <span>{step}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the beautiful, animated features that make Mindful Day the perfect companion 
            for your wellness and productivity journey
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={feature.id}>
              <FeatureCard feature={feature} index={index} />
              <AnimatePresence>
                {activeDemo === feature.id && (
                  <DemoAnimation feature={feature} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Technical Features */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Built for Excellence
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="card p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center card p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Start your mindful journey today and discover how these powerful, beautifully animated 
            features can transform your daily routine and boost your well-being.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.button
              className="btn-primary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target className="w-5 h-5" />
              <span>Start Using Features</span>
            </motion.button>
            <motion.button
              className="btn-ghost flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-5 h-5" />
              <span>View Roadmap</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
