import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  EyeIcon, 
  CalendarIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import publicAxios from '../../lib/publicApi';

const RecentBlogPosts = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Extract unique tags from posts for filter categories
  const getCategories = (posts) => {
    const allTags = posts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return ['All', ...uniqueTags.slice(0, 6)];
  };

  const [categories, setCategories] = useState(['All']);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await publicAxios.get('/posts');
        
        if (!response?.data) {
          throw new Error('Invalid API response format');
        }
        
        const { posts, total, page, pages } = response.data.data;
        
        // Filter only published posts and sort by publishedAt
        const publishedPosts = posts
          .filter(post => post.published)
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        setBlogPosts(publishedPosts);
        setPagination({ total, page, pages });
        setCategories(getCategories(publishedPosts));
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = activeFilter === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.tags?.includes(activeFilter.toLowerCase()));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'react': '⚛️', 'javascript': '🟨', 'typescript': '🔷',
      'nextjs': '▲', 'next.js': '▲', 'nodejs': '🟢',
      'python': '🐍', 'ai': '🤖', 'machine-learning': '🤖',
      'css': '🎨', 'devops': '⚙️', 'docker': '🐳'
    };
    return iconMap[category.toLowerCase()] || '💻';
  };

  const getReadTime = (content) => {
    if (!content) return '5 min';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  };

  const truncateExcerpt = (excerpt, maxLength = 120) => {
    if (!excerpt) return '';
    return excerpt.length > maxLength ? excerpt.substring(0, maxLength) + '...' : excerpt;
  };

  const formatTagForDisplay = (tag) => {
    return tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading posts...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Latest Guides
              </h2>
              <p className="text-gray-600 mt-1">
                {pagination.total} articles available
              </p>
            </div>
            
            <Link 
              href="/guides" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
            >
              View all
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category !== 'All' && (
                    <span className="mr-1">{getCategoryIcon(category)}</span>
                  )}
                  {formatTagForDisplay(category)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(0, 6).map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                <Link href={`/guides/${post.slug}`} className="block">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-4xl text-gray-400">
                        {post.tags?.length > 0 ? getCategoryIcon(post.tags[0]) : '📄'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category */}
                    {post.tags && post.tags.length > 0 && (
                      <span className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2">
                        <span className="mr-1">{getCategoryIcon(post.tags[0])}</span>
                        {formatTagForDisplay(post.tags[0])}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {truncateExcerpt(post.excerpt)}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {getReadTime(post.content)}
                        </span>
                      </div>
                      
                      <span className="flex items-center gap-1">
                        <EyeIcon className="w-3 h-3" />
                        {post.views || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">
              {activeFilter === 'All' 
                ? "No published posts available yet."
                : `No posts found for "${formatTagForDisplay(activeFilter)}".`
              }
            </p>
          </div>
        )}

        {/* View More */}
        {filteredPosts.length > 6 && (
          <div className="text-center mt-8">
            <Link 
              href="/guides" 
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All {filteredPosts.length} Guides
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentBlogPosts;