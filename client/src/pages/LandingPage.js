import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Shield,
  Mail,
  Github,
  Linkedin,
  Code,
  Coffee,
  BarChart3,
  CheckSquare,
  MessageCircle,
  Settings,
  Smartphone,
  Palette
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Overview',
      description: 'Get a comprehensive view of your wellness journey with beautiful, animated insights.',
      color: 'from-blue-500 to-cyan-500',
      highlights: ['Real-time updates', 'Interactive charts', 'Progress tracking']
    },
    {
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Organize your tasks with intelligent prioritization and satisfying animations.',
      color: 'from-green-500 to-teal-500',
      highlights: ['Priority levels', 'Real-time search', 'Completion effects']
    },
    {
      icon: Heart,
      title: 'Mood Journaling',
      description: 'Track your emotional well-being with emoji selection and detailed analytics.',
      color: 'from-pink-500 to-rose-500',
      highlights: ['Emoji morphing', 'Mood patterns', 'Personal notes']
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Visualize your productivity and wellness trends with interactive charts.',
      color: 'from-purple-500 to-indigo-500',
      highlights: ['Productivity scoring', 'Trend analysis', 'Insights']
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Get personalized guidance with our intelligent chatbot for wellness support.',
      color: 'from-violet-500 to-purple-500',
      highlights: ['AI-powered responses', '24/7 availability', 'Wellness expertise']
    },
    {
      icon: Sparkles,
      title: 'Features Showcase',
      description: 'Explore interactive demonstrations of all features with live animations.',
      color: 'from-indigo-500 to-blue-500',
      highlights: ['Interactive demos', 'Live previews', 'Feature explanations']
    },
    {
      icon: Target,
      title: 'Habit Tracker',
      description: 'Build positive habits with daily tracking and streak counting.',
      color: 'from-orange-500 to-red-500',
      highlights: ['Daily progress', 'Streak tracking', 'Custom habits']
    },
    {
      icon: Award,
      title: 'Goals & Objectives',
      description: 'Set and achieve long-term goals with milestone tracking and progress bars.',
      color: 'from-yellow-500 to-orange-500',
      highlights: ['Milestone system', 'Progress visualization', 'Achievement tracking']
    },
    {
      icon: Users,
      title: 'Community Inspiration',
      description: 'Share motivational quotes with a beautiful 3D carousel and community features.',
      color: 'from-emerald-500 to-green-500',
      highlights: ['3D carousel', 'Quote sharing', 'Community connection']
    },
    {
      icon: Settings,
      title: 'Personalization',
      description: 'Customize your experience with themes, notifications, and privacy settings.',
      color: 'from-gray-500 to-gray-600',
      highlights: ['Theme switching', 'Notification control', 'Privacy settings']
    }
  ];

  const floatingIcons = [
    { icon: Heart, delay: 0, x: 100, y: 50 },
    { icon: CheckSquare, delay: 0.5, x: -80, y: 100 },
    { icon: TrendingUp, delay: 1, x: 120, y: -60 },
    { icon: Users, delay: 1.5, x: -100, y: -80 },
    { icon: Sparkles, delay: 2, x: 80, y: 120 },
    { icon: Star, delay: 2.5, x: -120, y: 60 }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-shift" />
        
        {/* Floating Icons */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="absolute opacity-10 dark:opacity-5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                x: [item.x, item.x + 20, item.x],
                y: [item.y, item.y - 20, item.y]
              }}
              transition={{
                delay: item.delay,
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${50 + item.x}px`,
                top: `${50 + item.y}px`
              }}
            >
              <Icon className="w-12 h-12 text-primary-500" />
            </motion.div>
          );
        })}
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 px-4 py-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">AI Productivity Suite</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl glass dark:glass-dark hover:scale-110 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? (
                <motion.div
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="w-5 h-5 text-primary-600" />
                </motion.div>
              )}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-300"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">AI-Powered</span>{' '}
              <span className="text-gray-800 dark:text-white">Productivity</span>
              <br />
              <span className="text-gray-600 dark:text-gray-300 text-4xl md:text-5xl">
                & Wellness Suite
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your daily routine with our AI-powered productivity and wellness platform. 
            10+ intelligent features including voice assistant, smart analytics, habit tracking, and personalized insights.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 glow-effect"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-8 py-4 glass dark:glass-dark text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              AI-Powered{' '}
              <span className="text-gradient">Productivity Suite</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover 10+ intelligent features with voice assistant, smart analytics, and AI-driven insights 
              designed to revolutionize your productivity and wellness journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="card-glass text-center group hover:scale-105 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  {feature.highlights && (
                    <div className="space-y-1">
                      {feature.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="w-1 h-1 bg-primary-500 rounded-full" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Feature Categories */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Overview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard & Analytics</p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Wellness</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks, Mood, Habits & Goals</p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Connect</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI Assistant & Community</p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">More</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Features & Settings</p>
            </motion.div>
          </motion.div>

          {/* Interactive Demo Preview */}
          <motion.div
            className="card-glass text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Experience the Magic ✨
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Every feature is beautifully animated with Framer Motion, providing smooth transitions, 
              delightful interactions, and a premium user experience that makes wellness enjoyable.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Smooth Animations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Every interaction feels delightful</p>
              </div>

              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    boxShadow: [
                      "0 4px 20px rgba(59, 130, 246, 0.3)",
                      "0 8px 30px rgba(147, 51, 234, 0.4)",
                      "0 4px 20px rgba(59, 130, 246, 0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Smartphone className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Responsive Design</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Perfect on all devices</p>
              </div>

              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center"
                  animate={{ 
                    background: [
                      "linear-gradient(45deg, #ec4899, #f43f5e)",
                      "linear-gradient(45deg, #8b5cf6, #ec4899)",
                      "linear-gradient(45deg, #06b6d4, #8b5cf6)",
                      "linear-gradient(45deg, #ec4899, #f43f5e)"
                    ]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Palette className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Beautiful UI</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Glassmorphism & modern design</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center card-glass"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[Shield, Zap, Star].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            Ready to Transform Your Daily Routine?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already discovered the power of mindful living. 
            Start your journey today and experience the difference.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 px-4 py-12 border-t border-white/20 dark:border-gray-700/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Developer Info Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <motion.div
                className="inline-flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Code className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  Crafted with Passion
                </span>
                <Coffee className="w-6 h-6 text-orange-500" />
              </motion.div>
            </div>

            <div className="max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-2xl font-bold text-white">SP</span>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  Suyog Patil
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Full Stack Developer & AI Enthusiast
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
                <motion.a
                  href="mailto:developer@famt.ac.in"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-4 h-4 group-hover:animate-bounce" />
                  <span className="text-sm font-medium">developer@famt.ac.in</span>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/suyog-patil-5622ba26b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-4 h-4 group-hover:animate-pulse" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </motion.a>

                <motion.a
                  href="https://github.com/Suyog-Sandip-Patil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-4 h-4 group-hover:animate-spin" />
                  <span className="text-sm font-medium">GitHub</span>
                </motion.a>
              </div>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  "Building the future, one line of code at a time" ✨
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Copyright Section */}
          <motion.div
            className="text-center border-t border-white/10 dark:border-gray-700/20 pt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.p
              className="text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span>© 2025 AI Productivity Suite.</span>
              <motion.span
                className="inline-block"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                ❤️
              </motion.span>
              <span>Made with passion for intelligent productivity and wellness.</span>
            </motion.p>
            
            <motion.div
              className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <motion.span
                whileHover={{ scale: 1.1, color: '#3b82f6' }}
                className="cursor-default"
              >
                React ⚛️
              </motion.span>
              <span>•</span>
              <motion.span
                whileHover={{ scale: 1.1, color: '#10b981' }}
                className="cursor-default"
              >
                Node.js 🟢
              </motion.span>
              <span>•</span>
              <motion.span
                whileHover={{ scale: 1.1, color: '#8b5cf6' }}
                className="cursor-default"
              >
                AI Powered 🤖
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
