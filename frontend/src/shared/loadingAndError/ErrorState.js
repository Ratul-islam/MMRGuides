import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ErrorState = ({ 
  error, 
  onRetry, 
  title = "Something went wrong",
  showContactSupport = true,
  showGoHome = true 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorDetails = (error) => {
    const errorMap = {
      'Network Error': {
        message: 'Unable to connect to our servers. Please check your internet connection.',
        suggestion: 'Try refreshing the page or check your network connection.',
        icon: '🌐'
      },
      'Failed to fetch guides': {
        message: 'We encountered an issue while loading the guides.',
        suggestion: 'This is usually temporary. Please try again in a moment.',
        icon: '📚'
      },
      'Invalid API response format': {
        message: 'We received an unexpected response from our servers.',
        suggestion: 'Our team has been notified. Please try again later.',
        icon: '⚠️'
      },
      'Timeout': {
        message: 'The request took too long to complete.',
        suggestion: 'Please check your connection and try again.',
        icon: '⏱️'
      }
    };

    return errorMap[error] || {
      message: 'An unexpected error occurred.',
      suggestion: 'Please try refreshing the page or contact support if the problem persists.',
      icon: '❌'
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6">
      <motion.div
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Error Icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
          </div>
          
          {/* Floating error emoji */}
          <motion.div
            className="absolute -top-2 -right-2 text-4xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {errorDetails.icon}
          </motion.div>
        </motion.div>

        {/* Error Content */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-4 leading-relaxed">
            {errorDetails.message}
          </p>
          
          <p className="text-gray-500 mb-8">
            {errorDetails.suggestion}
          </p>

          {/* Error Details Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-8 text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Error Details</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <span className="font-medium">Error:</span> {error}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {new Date().toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">User:</span> Ratul-islam
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Retry Button */}
          <motion.button
            onClick={handleRetry}
            disabled={isRetrying}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRetrying ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Retrying...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </>
            )}
          </motion.button>

          {/* Go Home Button */}
          {showGoHome && (
            <motion.a
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Go Home
            </motion.a>
          )}

          {/* Contact Support Button */}
          {showContactSupport && (
            <motion.a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-3" />
              Contact Support
            </motion.a>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="font-semibold text-blue-900 mb-2">Need immediate help?</h3>
          <p className="text-blue-700 text-sm">
            If this error persists, please contact our support team with the error details above. 
            We're here to help you get back to learning!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2 hover:no-underline transition-all"
          >
            🔄 Refresh Page
          </button>
          
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2 hover:no-underline transition-all"
          >
            🗑️ Clear Cache
          </button>
          
          <a
            href="/guides"
            className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2 hover:no-underline transition-all"
          >
            📚 Browse All Guides
          </a>
          
          <a
            href="/status"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2 hover:no-underline transition-all"
          >
            📊 System Status
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorState;