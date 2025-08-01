export const getCategories = (guides) => {
  const allTags = guides.flatMap(guide => guide.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return ['All', ...uniqueTags.slice(0, 15)];
};

export const filterAndSortGuides = (guides, searchTerm, activeFilter, sortBy) => {
  return guides
    .filter(guide => {
      const matchesSearch = !searchTerm || 
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = activeFilter === 'All' || 
        guide.tags?.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
        case 'oldest':
          return new Date(a.publishedAt || a.createdAt) - new Date(b.publishedAt || b.createdAt);
        case 'mostViewed':
          return (b.views || 0) - (a.views || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'trending':
          return (b.recentViews || 0) - (a.recentViews || 0);
        default:
          return 0;
      }
    });
};

export const getDifficultyColor = (tags) => {
  if (tags?.some(tag => tag.includes('beginner') || tag.includes('basic'))) {
    return 'bg-green-100/80 text-green-800 border-green-200';
  }
  if (tags?.some(tag => tag.includes('advanced') || tag.includes('expert'))) {
    return 'bg-red-100/80 text-red-800 border-red-200';
  }
  return 'bg-yellow-100/80 text-yellow-800 border-yellow-200';
};

export const getDifficultyLevel = (tags) => {
  if (tags?.some(tag => tag.includes('beginner') || tag.includes('basic'))) {
    return 'Beginner';
  }
  if (tags?.some(tag => tag.includes('advanced') || tag.includes('expert'))) {
    return 'Advanced';
  }
  return 'Intermediate';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getCategoryIcon = (category) => {
  const iconMap = {
    'react': '⚛️', 'javascript': '🟨', 'typescript': '🔷',
    'nextjs': '▲', 'next.js': '▲', 'nodejs': '🟢',
    'node.js': '🟢', 'backend': '🖥️', 'css': '🎨',
    'devops': '⚙️', 'frontend': '🎨', 'api': '🔌',
    'database': '🗄️', 'docker': '🐳', 'git': '📚',
    'python': '🐍', 'vue': '💚', 'angular': '🔺',
    'express': '🚂', 'mongodb': '🍃', 'sql': '📊',
    'aws': '☁️', 'testing': '🧪', 'security': '🔒',
    'performance': '⚡', 'mobile': '📱', 'webdev': '💻',
    'tutorial': '📖', 'computer-vision': '👁️', 'opencv': '📷',
    'deep-learning': '🧠', 'keras': '🤖', 'tensorflow': '🔥',
    'machine-learning': '🤖', 'ai': '🤖', 'data-science': '📊',
    'neural-networks': '🧠'
  };
  return iconMap[category.toLowerCase()] || '💻';
};

export const getReadTime = (content) => {
  if (!content) return '5 min read';
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

export const truncateExcerpt = (excerpt, maxLength = 150) => {
  if (!excerpt) return '';
  return excerpt.length > maxLength ? excerpt.substring(0, maxLength) + '...' : excerpt;
};

export const formatTagForDisplay = (tag) => {
  return tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};