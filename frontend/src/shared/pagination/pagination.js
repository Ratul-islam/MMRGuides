import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  totalItems = 0,
  itemsPerPage = 12,
  onPageChange,
  onLoadMore,
  loading = false,
  showLoadMore = true,
  showPageNumbers = true,
  showPageInfo = true,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const getPageNumbers = () => {
    const delta = 2; 
    const range = [];
    const rangeWithDots = [];

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) {
        rangeWithDots.push('...');
      }
    } else if (start === 2) {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    } else if (end === totalPages - 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = async (page) => {
    if (page === currentPage || isAnimating || loading) return;
    
    setIsAnimating(true);
    try {
      await onPageChange(page);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleLoadMore = async () => {
    if (loading || currentPage >= totalPages) return;
    
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Load more failed:', error);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showLoadMore) {
    return null;
  }

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Page Info */}
        {showPageInfo && totalItems > 0 && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{startItem}</span> to{' '}
              <span className="font-semibold text-indigo-600">{endItem}</span> of{' '}
              <span className="font-semibold">{totalItems}</span> guides
            </p>
          </motion.div>
        )}

        {/* Load More Button (Mobile First Approach) */}
        {showLoadMore && currentPage < totalPages && (
          <motion.div
            className="text-center mb-8 md:hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.button
              onClick={handleLoadMore}
              disabled={loading}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Loading More...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" />
                  Load More Guides
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                    {totalPages - currentPage} more pages
                  </span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {showPageNumbers && totalPages > 1 && (
          <motion.div
            className="hidden md:flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isAnimating}
              className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="First page"
            >
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isAnimating}
              className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center space-x-1">
              <AnimatePresence mode="wait">
                {getPageNumbers().map((pageNum, index) => (
                  <motion.div
                    key={`${pageNum}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pageNum === '...' ? (
                      <div className="px-3 py-2 text-gray-400">
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isAnimating}
                        className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 min-w-[44px] ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-300 hover:border-indigo-300'
                        }`}
                        whileHover={{ scale: currentPage === pageNum ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {pageNum}
                        {currentPage === pageNum && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isAnimating}
              className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Next page"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isAnimating}
              className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Last page"
            >
              <ChevronDoubleRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        <motion.div
          className="md:hidden text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isAnimating}
              className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              Previous
            </motion.button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Page</span>
              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-semibold">
                {currentPage}
              </div>
              <span className="text-gray-600">of {totalPages}</span>
            </div>

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isAnimating}
              className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <ChevronRightIcon className="w-5 h-5 ml-1" />
            </motion.button>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentPage / totalPages) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Start</span>
            <span>{Math.round((currentPage / totalPages) * 100)}% Complete</span>
            <span>End</span>
          </div>
        </motion.div>

        {showLoadMore && currentPage < totalPages && (
          <motion.div
            className="hidden md:block text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <motion.button
              onClick={handleLoadMore}
              disabled={loading}
              className="group inline-flex items-center px-6 py-3 bg-white border-2 border-indigo-300 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Load More ({totalPages - currentPage} pages remaining)
                </>
              )}
            </motion.button>
          </motion.div>
        )}
    </div>
    </div>
  );
};

export default Pagination;