import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600 mx-auto mb-6"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Guides</h2>
        <p className="text-gray-600">Fetching the latest development tutorials...</p>
      </motion.div>
    </div>
  );
};

export default LoadingState;