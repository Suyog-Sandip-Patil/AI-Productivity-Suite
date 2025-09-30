import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Settings as SettingsIcon,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Check,
  X,
  AlertCircle,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
const Settings = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: ''
  });
  const [aiSettings, setAiSettings] = useState({
    apiKey: '',
    provider: 'openai',
    voiceEnabled: true,
    autoSpeak: true
  });
  const [settings, setSettings] = useState({
    notifications: {
      taskReminders: true,
      moodReminders: true,
      dailyQuotes: true,
      weeklyReports: false,
      soundEnabled: true
    },
    privacy: {
      profileVisible: true,
      shareProgress: false,
      dataCollection: true
    },
    preferences: {
      language: 'en',
      timezone: 'auto',
      dateFormat: 'MM/DD/YYYY',
      startOfWeek: 'monday'
    }
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mindful-day-settings');
    const savedProfile = localStorage.getItem('mindful-day-profile');
    const savedAiSettings = localStorage.getItem('mindful-day-ai-settings');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    if (savedAiSettings) {
      try {
        setAiSettings(JSON.parse(savedAiSettings));
      } catch (error) {
        console.error('Error loading AI settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mindful-day-settings', JSON.stringify(settings));
  }, [settings]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Export user data
  const exportData = async () => {
    setIsLoading(true);
    try {
      // Gather all user data
      const userData = {
        profile: profileData,
        settings: settings,
        tasks: JSON.parse(localStorage.getItem('mindful-day-tasks') || '[]'),
        moods: JSON.parse(localStorage.getItem('mindful-day-moods') || '[]'),
        habits: JSON.parse(localStorage.getItem('mindful-day-habits') || '[]'),
        goals: JSON.parse(localStorage.getItem('mindful-day-goals') || '[]'),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Create and download file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mindful-day-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      showNotification('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Import user data
  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsLoading(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Validate data structure
        if (!data.version || !data.exportDate) {
          throw new Error('Invalid backup file format');
        }

        // Import data
        if (data.profile) {
          setProfileData(data.profile);
          localStorage.setItem('mindful-day-profile', JSON.stringify(data.profile));
        }
        
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('mindful-day-settings', JSON.stringify(data.settings));
        }
        
        if (data.tasks) {
          localStorage.setItem('mindful-day-tasks', JSON.stringify(data.tasks));
        }
        
        if (data.moods) {
          localStorage.setItem('mindful-day-moods', JSON.stringify(data.moods));
        }
        
        if (data.habits) {
          localStorage.setItem('mindful-day-habits', JSON.stringify(data.habits));
        }
        
        if (data.goals) {
          localStorage.setItem('mindful-day-goals', JSON.stringify(data.goals));
        }

        showNotification('Data imported successfully! Please refresh the page to see changes.');
      } catch (error) {
        console.error('Import error:', error);
        showNotification('Failed to import data. Please check the file format.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    input.click();
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('mindful-day-settings');
      localStorage.removeItem('mindful-day-profile');
      localStorage.removeItem('mindful-day-tasks');
      localStorage.removeItem('mindful-day-moods');
      localStorage.removeItem('mindful-day-habits');
      localStorage.removeItem('mindful-day-goals');
      
      // Reset state
      setSettings({
        notifications: {
          taskReminders: true,
          moodReminders: true,
          dailyQuotes: true,
          weeklyReports: false,
          soundEnabled: true
        },
        privacy: {
          profileVisible: true,
          shareProgress: false,
          dataCollection: true
        },
        preferences: {
          language: 'en',
          timezone: 'auto',
          dateFormat: 'MM/DD/YYYY',
          startOfWeek: 'monday'
        }
      });
      
      setProfileData({ name: user?.name || '', bio: '' });
      showNotification('All data cleared successfully!');
    }
  };

  // Save profile
  const saveProfile = () => {
    localStorage.setItem('mindful-day-profile', JSON.stringify(profileData));
    showNotification('Profile saved successfully!');
  };

  // Save AI settings
  const saveAiSettings = () => {
    localStorage.setItem('mindful-day-ai-settings', JSON.stringify(aiSettings));
    showNotification('AI settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai', label: 'AI Settings', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    showNotification('Setting updated successfully');
  };

  const SettingToggle = ({ label, description, checked, onChange, icon: Icon }) => (
    <motion.div
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        <div>
          <h3 className="font-medium text-gray-800 dark:text-white">{label}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      <motion.button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: checked ? 24 : 2 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Your display name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <motion.button
                onClick={saveProfile}
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </motion.button>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                🤖 AI Assistant Configuration
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Configure your AI assistant with your own API key for enhanced responses and voice features.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Provider
                </label>
                <select 
                  value={aiSettings.provider}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, provider: e.target.value }))}
                  className="input-field"
                >
                  <option value="openai">OpenAI (GPT-3.5/GPT-4)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="groq">Groq (Fast Inference)</option>
                  <option value="local">Local/Fallback Responses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={aiSettings.apiKey}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="Enter your API key..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your API key is stored locally and never shared. Leave empty to use fallback responses.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <SettingToggle
                  label="Voice Assistant"
                  description="Enable voice input and output"
                  checked={aiSettings.voiceEnabled}
                  onChange={(value) => setAiSettings(prev => ({ ...prev, voiceEnabled: value }))}
                  icon={Volume2}
                />
                
                <SettingToggle
                  label="Auto-Speak Responses"
                  description="Automatically speak AI responses"
                  checked={aiSettings.autoSpeak}
                  onChange={(value) => setAiSettings(prev => ({ ...prev, autoSpeak: value }))}
                  icon={Play}
                />
              </div>

              <motion.button
                onClick={saveAiSettings}
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save AI Settings
              </motion.button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <SettingToggle
              label="Task Reminders"
              description="Get notified about upcoming and overdue tasks"
              checked={settings.notifications.taskReminders}
              onChange={(value) => handleSettingChange('notifications', 'taskReminders', value)}
              icon={Bell}
            />
            
            <SettingToggle
              label="Mood Check-ins"
              description="Daily reminders to log your mood"
              checked={settings.notifications.moodReminders}
              onChange={(value) => handleSettingChange('notifications', 'moodReminders', value)}
              icon={Bell}
            />
            
            <SettingToggle
              label="Daily Quotes"
              description="Receive inspirational quotes each morning"
              checked={settings.notifications.dailyQuotes}
              onChange={(value) => handleSettingChange('notifications', 'dailyQuotes', value)}
              icon={Bell}
            />
            
            <SettingToggle
              label="Weekly Reports"
              description="Get weekly progress summaries"
              checked={settings.notifications.weeklyReports}
              onChange={(value) => handleSettingChange('notifications', 'weeklyReports', value)}
              icon={Bell}
            />
            
            <SettingToggle
              label="Sound Effects"
              description="Play sounds for notifications and interactions"
              checked={settings.notifications.soundEnabled}
              onChange={(value) => handleSettingChange('notifications', 'soundEnabled', value)}
              icon={settings.notifications.soundEnabled ? Volume2 : VolumeX}
            />
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">Theme</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    {darkMode ? (
                      <Moon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {darkMode ? 'Easy on the eyes' : 'Bright and clear'}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={toggleDarkMode}
                  className="btn-ghost p-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Switch to {darkMode ? 'Light' : 'Dark'}
                </motion.button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select className="input-field">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select className="input-field">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <SettingToggle
              label="Profile Visibility"
              description="Make your profile visible to other users"
              checked={settings.privacy.profileVisible}
              onChange={(value) => handleSettingChange('privacy', 'profileVisible', value)}
              icon={settings.privacy.profileVisible ? Eye : EyeOff}
            />
            
            <SettingToggle
              label="Share Progress"
              description="Allow sharing your progress with the community"
              checked={settings.privacy.shareProgress}
              onChange={(value) => handleSettingChange('privacy', 'shareProgress', value)}
              icon={Globe}
            />
            
            <SettingToggle
              label="Analytics & Insights"
              description="Help improve the app with anonymous usage data"
              checked={settings.privacy.dataCollection}
              onChange={(value) => handleSettingChange('privacy', 'dataCollection', value)}
              icon={Shield}
            />

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                Data Protection
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Your data is encrypted and stored securely. We never share personal information with third parties.
              </p>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <motion.button
                onClick={exportData}
                disabled={isLoading}
                className="card p-6 text-center hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-8 h-8 mx-auto mb-3 text-primary-500" />
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                  {isLoading ? 'Exporting...' : 'Export Data'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download all your data in JSON format
                </p>
              </motion.button>

              <motion.button
                onClick={importData}
                disabled={isLoading}
                className="card p-6 text-center hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-green-500" />
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                  {isLoading ? 'Importing...' : 'Import Data'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Restore data from a backup file
                </p>
              </motion.button>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-3 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Danger Zone
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                These actions cannot be undone. Please be careful.
              </p>
              <div className="space-y-2">
                <motion.button
                  onClick={clearAllData}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear All Data
                </motion.button>
                <motion.button
                  onClick={() => showNotification('Account deletion feature coming soon!', 'info')}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-red-800 hover:bg-red-900 text-white rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete Account
                </motion.button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <SettingsIcon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your AI Productivity Suite experience
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap justify-center mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          key={activeTab}
        >
          {renderTabContent()}
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
                notification.type === 'success' 
                  ? 'bg-green-500 text-white' 
                  : notification.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                {notification.type === 'success' && <Check className="w-5 h-5" />}
                {notification.type === 'error' && <X className="w-5 h-5" />}
                {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
