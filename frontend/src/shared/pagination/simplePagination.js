import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const SimplePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="flex items-center justify-center space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`flex items-center ${sizeClasses[size]} bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeftIcon className={`${iconSizes[size]} mr-1`} />
        Previous
      </motion.button>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Page</span>
        <span className={`${sizeClasses[size]} bg-indigo-100 text-indigo-700 rounded-lg font-semibold`}>
          {currentPage}
        </span>
        <span className="text-gray-600">of {totalPages}</span>
      </div>

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`flex items-center ${sizeClasses[size]} bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Next
        <ChevronRightIcon className={`${iconSizes[size]} ml-1`} />
      </motion.button>
    </motion.div>
  );
};

export default SimplePagination;