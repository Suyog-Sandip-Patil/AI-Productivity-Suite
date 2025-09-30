import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Heart, 
  Users, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut,
  User,
  TrendingUp,
  MessageCircle,
  Sparkles,
  Target,
  Award,
  Settings,
  BookOpen,
  Rocket,
  ChevronDown,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  // Main navigation items (always visible)
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp, color: 'from-purple-500 to-indigo-500' },
    { path: '/chatbot', label: 'AI Assistant', icon: MessageCircle, color: 'from-violet-500 to-purple-500', badge: 'Voice' },
  ];

  // Dropdown navigation groups
  const dropdownGroups = [
    {
      title: 'Productivity',
      icon: CheckSquare,
      color: 'from-green-500 to-teal-500',
      items: [
        { path: '/tasks', label: 'Tasks', icon: CheckSquare, description: 'Manage your tasks' },
        { path: '/habits', label: 'Habits', icon: Target, description: 'Build positive habits' },
        { path: '/goals', label: 'Goals', icon: Award, description: 'Achieve your dreams' },
        { path: '/mood', label: 'Mood', icon: Heart, description: 'Track your emotions' },
      ]
    },
    {
      title: 'Growth & Learning',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-500',
      items: [
        { path: '/growth', label: 'Growth Opportunities', icon: Rocket, description: 'Trending growth tips', badge: 'New' },
        { path: '/learning', label: 'Learning Hub', icon: BookOpen, description: 'Educational resources' },
        { path: '/community', label: 'Community', icon: Users, description: 'Connect with others' },
      ]
    },
    {
      title: 'More',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500',
      items: [
        { path: '/features', label: 'Features', icon: Sparkles, description: 'Explore all features' },
        { path: '/settings', label: 'Settings', icon: Settings, description: 'Customize your experience' },
        { path: '/contact', label: 'Contact Us', icon: Mail, description: 'Get in touch with us' },
      ]
    }
  ];

  // Flatten for mobile menu
  const allNavItems = [
    ...mainNavItems,
    ...dropdownGroups.flatMap(group => group.items)
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="sticky top-0 z-50 glass dark:glass-dark border-b border-white/20 dark:border-gray-700/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AI Productivity Suite</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Main Navigation Items */}
            {mainNavItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Background gradient */}
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive(item.path) ? 'opacity-100' : ''
                    }`}
                    layoutId={isActive(item.path) ? 'activeTab' : undefined}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}

            {/* Dropdown Navigation Groups */}
            {dropdownGroups.map((group, groupIndex) => {
              const GroupIcon = group.icon;
              const hasActiveItem = group.items.some(item => isActive(item.path));
              
              return (
                <div key={group.title} className="relative">
                  <motion.button
                    onClick={() => setActiveDropdown(activeDropdown === group.title ? null : group.title)}
                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-300 group ${
                      hasActiveItem || activeDropdown === group.title
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (mainNavItems.length + groupIndex) * 0.1 }}
                  >
                    {/* Background gradient */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${group.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        hasActiveItem || activeDropdown === group.title ? 'opacity-100' : ''
                      }`}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center space-x-2">
                      <GroupIcon className="w-4 h-4" />
                      <span className="text-sm">{group.title}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === group.title ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === group.title && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-2">
                          {group.items.map((item, itemIndex) => {
                            const ItemIcon = item.icon;
                            return (
                              <motion.button
                                key={item.path}
                                onClick={() => {
                                  navigate(item.path);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                                  isActive(item.path)
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.05 }}
                              >
                                <ItemIcon className="w-4 h-4 flex-shrink-0" />
                                <div className="flex-1 text-left">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">{item.label}</span>
                                    {item.badge && (
                                      <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-5 h-5 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-xl bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 card-glass border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden py-4 border-t border-white/20 dark:border-gray-700/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                {allNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive(item.path)
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
