export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getReadTime = (content) => {
  if (!content) return '5 min read';
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

export const getCategoryIcon = (category) => {
  const iconMap = {
    'react': '⚛️',
    'javascript': '🟨',
    'typescript': '🔷',
    'nextjs': '▲',
    'next.js': '▲',
    'nodejs': '🟢',
    'node.js': '🟢',
    'backend': '🖥️',
    'css': '🎨',
    'devops': '⚙️',
    'frontend': '🎨',
    'api': '🔌',
    'database': '🗄️',
    'docker': '🐳',
    'git': '📚',
    'python': '🐍',
    'vue': '💚',
    'angular': '🔺',
    'express': '🚂',
    'mongodb': '🍃',
    'sql': '📊',
    'aws': '☁️',
    'testing': '🧪',
    'security': '🔒',
    'performance': '⚡',
    'mobile': '📱',
    'webdev': '💻',
    'tutorial': '📖',
    'computer-vision': '👁️',
    'opencv': '📷',
    'deep-learning': '🧠',
    'keras': '🤖',
    'tensorflow': '🔥',
    'machine-learning': '🤖',
    'ai': '🤖',
    'data-science': '📊',
    'neural-networks': '🧠'
  };
  return iconMap[category?.toLowerCase()] || '💻';
};

export const formatTagForDisplay = (tag) => {
  return tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const renderContent = (content) => {
  if (!content) return '';
  
  // Enhanced markdown to HTML conversion
  let html = content
    // Headers with proper IDs and styling
    .replace(/^# (.*$)/gim, '<h1 id="$1" class="text-4xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-24 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 id="$1" class="text-3xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 id="$1" class="text-2xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-24">$1</h3>')
    // Text formatting
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic text-indigo-600">$1</em>')
    // Enhanced code blocks
    .replace(/```([\s\S]*?)```/gim, '<div class="relative group my-8"><pre class="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-6 rounded-2xl overflow-x-auto font-mono text-sm shadow-2xl border border-gray-700"><code>$1</code></pre><button class="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" onclick="navigator.clipboard.writeText(this.parentElement.querySelector(\'code\').textContent)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button></div>')
    .replace(/`([^`]*)`/gim, '<code class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-2 py-1 rounded-lg text-sm font-mono border border-indigo-200">$1</code>')
    // Enhanced links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-indigo-600 hover:text-purple-600 underline decoration-2 underline-offset-2 hover:decoration-purple-600 transition-all duration-200 font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
    // Lists with better styling
    .replace(/^\- (.*$)/gim, '<li class="mb-2 flex items-start"><span class="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span><span>$1</span></li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="mb-2 flex items-start"><span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">$1</span><span>$2</span></li>')
    // Paragraphs with better spacing
    .replace(/\n\n/gim, '</p><p class="mb-6 leading-relaxed text-gray-700">')
    .replace(/\n/gim, '<br>');
  
  // Wrap lists in styled containers
  html = html.replace(/(<li.*?<\/li>)/gims, '<ul class="space-y-2 ml-0 mb-6 list-none">$1</ul>');
  
  // Wrap in paragraphs
  html = '<p class="mb-6 leading-relaxed text-gray-700">' + html + '</p>';
  
  return html;
};