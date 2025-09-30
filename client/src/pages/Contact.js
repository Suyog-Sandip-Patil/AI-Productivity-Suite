import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Heart,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare, color: 'blue' },
    { value: 'support', label: 'Technical Support', icon: Zap, color: 'orange' },
    { value: 'feedback', label: 'Feedback', icon: Star, color: 'purple' },
    { value: 'business', label: 'Business Partnership', icon: Sparkles, color: 'green' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
    
    toast.success('Message sent successfully! We\'ll get back to you soon.', {
      duration: 5000,
      icon: '🚀',
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'developer@famt.ac.in',
      description: 'Send us an email anytime',
      color: 'blue',
      action: () => window.open('mailto:developer@famt.ac.in')
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri from 9am to 6pm',
      color: 'green',
      action: () => window.open('tel:+919876543210')
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Mumbai, Maharashtra, India',
      description: 'Come say hello at our office',
      color: 'purple',
      action: () => window.open('https://maps.google.com/?q=Mumbai,Maharashtra,India')
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      url: 'https://github.com/Suyog-Sandip-Patil',
      color: 'gray'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/suyog-patil-5622ba26b',
      color: 'blue'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: 'https://twitter.com',
      color: 'sky'
    },
    {
      icon: Globe,
      name: 'Portfolio',
      url: 'https://portfolio.example.com',
      color: 'indigo'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-32 h-32 rounded-full opacity-10 ${
                i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        {/* Header Section */}
        <motion.div
          className="text-center mb-16 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mr-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              variants={floatingVariants}
              animate="animate"
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4"
            variants={itemVariants}
          >
            Get In{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Have questions, feedback, or just want to say hello? We'd love to hear from you! 
            Our team is here to help you make the most of your mindful journey.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 relative z-10">
          {/* Contact Form */}
          <motion.div
            className="card p-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex items-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Send us a message
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Contact Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {contactTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <motion.label
                            key={type.value}
                            className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all ${
                              formData.type === type.value
                                ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={formData.type === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-3">
                              <IconComponent className={`w-5 h-5 text-${type.color}-500`} />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {type.label}
                              </span>
                            </div>
                          </motion.label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="input-field pl-10"
                          placeholder="John Doe"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input-field pl-10"
                          placeholder="john@example.com"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Subject */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="How can we help you?"
                    />
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={index}
                    className="card p-6 cursor-pointer group"
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                      scale: 1.02
                    }}
                    onClick={info.action}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`w-12 h-12 bg-${info.color}-100 dark:bg-${info.color}-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className={`w-6 h-6 text-${info.color}-600 dark:text-${info.color}-400`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-500">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Developer Info */}
            <motion.div
              className="card p-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Built with ❤️ by Suyog Patil
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Full-Stack Developer & AI Enthusiast
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  "Building the future, one line of code at a time" ✨
                </p>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-${social.color}-100 dark:bg-${social.color}-900/30 rounded-lg flex items-center justify-center hover:bg-${social.color}-200 dark:hover:bg-${social.color}-800/50 transition-colors`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title={social.name}
                      >
                        <IconComponent className={`w-5 h-5 text-${social.color}-600 dark:text-${social.color}-400`} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              className="card p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Quick Response Time
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
