import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { 
  formatDate, 
  getReadTime, 
  formatTagForDisplay,
  getCategoryIcon 
} from '../../../lib/guidUtils';

const GuideCard = ({ guide, viewMode = 'grid', index = 0 }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    // Save to localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    if (isBookmarked) {
      const updated = bookmarks.filter(id => id !== guide._id);
      localStorage.setItem('bookmarkedGuides', JSON.stringify(updated));
    } else {
      bookmarks.push(guide._id);
      localStorage.setItem('bookmarkedGuides', JSON.stringify(bookmarks));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: index * 0.05 
      }
    }
  };

  const commonCardClasses = "group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer";

  if (viewMode === 'list') {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`${commonCardClasses} rounded-lg p-4 mb-3`}
      >
        <Link href={`/guides/${guide.slug}`} className="block">
          <div className="flex items-start justify-between gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Category Badge */}
              {guide.tags && guide.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    <span className="mr-1">{getCategoryIcon(guide.tags[0])}</span>
                    {formatTagForDisplay(guide.tags[0])}
                  </span>
                </div>
              )}
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {guide.title}
              </h3>
              
              {/* Excerpt */}
              {guide.excerpt && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {guide.excerpt}
                </p>
              )}
              
              {/* Meta Information */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDate(guide.publishedAt || guide.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {getReadTime(guide.content)}
                </span>
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-3 h-3" />
                  {(guide.views || 0).toLocaleString()} views
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-start gap-2 flex-shrink-0">
              <button
                onClick={handleBookmark}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkSolidIcon className="w-4 h-4 text-blue-600" />
                ) : (
                  <BookmarkOutlineIcon className="w-4 h-4" />
                )}
              </button>
              
              <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Grid Layout
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`${commonCardClasses} rounded-xl p-6 h-full flex flex-col`}
    >
      <Link href={`/guides/${guide.slug}`} className="block h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            {/* Category Badge */}
            {guide.tags && guide.tags.length > 0 && (
              <span className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                <span className="mr-1">{getCategoryIcon(guide.tags[0])}</span>
                {formatTagForDisplay(guide.tags[0])}
              </span>
            )}
            
            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-4 h-4 text-blue-600" />
              ) : (
                <BookmarkOutlineIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-3 group-hover:text-blue-600 transition-colors duration-200 flex-grow">
            {guide.title}
          </h3>
          
          {/* Excerpt */}
          {guide.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
              {guide.excerpt}
            </p>
          )}
          
          {/* Tags */}
          {guide.tags && guide.tags.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {guide.tags.slice(1, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {formatTagForDisplay(tag)}
                </span>
              ))}
              {guide.tags.length > 3 && (
                <span className="text-xs text-gray-400 px-2 py-1">
                  +{guide.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            {/* Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDate(guide.publishedAt || guide.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {getReadTime(guide.content)}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <EyeIcon className="w-3 h-3" />
                {(guide.views || 0).toLocaleString()}
              </div>
            </div>
            
            {/* Read More */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  R
                </div>
                <span className="text-xs text-gray-600 font-medium">Ratul Islam</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                <span>Read Guide</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default GuideCard;