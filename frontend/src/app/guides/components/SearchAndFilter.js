import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { formatTagForDisplay, getCategoryIcon } from '../../../lib/guidUtils';

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  categories,
  totalResults,
  totalGuides
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);

  return (
    <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-2">
        {/* Search Bar */}
        <motion.div 
          className="max-w-xl mx-auto mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search guides by title, content, or technologies..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full  text-xs pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300 bg-white shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Category Filters */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">Filter by Technology:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => onFilterChange(category)}
                  className={`group relative px-2 py-1 rounded-xl transition-all duration-300 text-xs ${
                    activeFilter === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    {category !== 'All' && (
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                    )}
                    {formatTagForDisplay(category)}
                  </span>
                  {activeFilter === category && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
              
              {categories.length > 8 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {showAllCategories ? 'Show Less' : `+${categories.length - 8} More`}
                </button>
              )}
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostViewed">Most Popular</option>
                <option value="alphabetical">A-Z</option>
                <option value="trending">Trending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <motion.div 
          className="mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600 text-xs">
            Showing <span className="font-bold text-indigo-600">{totalResults}</span> of{' '}
            <span className="font-bold">{totalGuides}</span> guides
            {activeFilter !== 'All' && (
              <span> in <span className="font-bold text-indigo-600">{formatTagForDisplay(activeFilter)}</span></span>
            )}
            {searchTerm && (
              <span> matching &quot;<span className="font-bold text-indigo-600">{searchTerm}</span>&quot;</span>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchAndFilters;