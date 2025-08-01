import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, Typography, Chip, Box, Paper } from '@mui/material';
import { AccessTime, TrendingUp } from '@mui/icons-material';

const mockRelatedPosts = [
  {
    id: 2,
    title: "Building Scalable React Applications with Next.js 15",
    excerpt: "Learn best practices for building large-scale React applications that can grow with your business using the latest Next.js features.",
    slug: "building-scalable-react-applications",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    readTime: "6 min read",
    publishedAt: "2025-07-25T10:00:00Z",
    tags: ["React", "Next.js", "Architecture"],
    views: 1234,
    trending: true
  },
  {
    id: 3,
    title: "CSS Container Queries: The Future of Responsive Design",
    excerpt: "Discover how CSS Container Queries are revolutionizing responsive design and replacing media queries for component-based layouts.",
    slug: "css-container-queries-guide",
    featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    readTime: "5 min read",
    publishedAt: "2025-07-20T10:00:00Z",
    tags: ["CSS", "Responsive Design", "Frontend"],
    views: 987,
    trending: false
  },
  {
    id: 4,
    title: "TypeScript 5.6: New Features and Improvements",
    excerpt: "Explore the latest TypeScript release with enhanced type inference, better performance, and new language features.",
    slug: "typescript-5-6-new-features",
    featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    readTime: "7 min read",
    publishedAt: "2025-07-15T10:00:00Z",
    tags: ["TypeScript", "JavaScript", "Development"],
    views: 1567,
    trending: true
  }
];

export default function RelatedPosts({ currentPostId, tags }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views.toString();
  };

  // Filter out current post and sort by relevance (matching tags)
  const relatedPosts = mockRelatedPosts
    .filter(post => post.id !== currentPostId)
    .sort((a, b) => {
      const aMatchingTags = a.tags.filter(tag => tags.includes(tag)).length;
      const bMatchingTags = b.tags.filter(tag => tags.includes(tag)).length;
      return bMatchingTags - aMatchingTags;
    });

  if (relatedPosts.length === 0) return null;

  return (
    <Paper elevation={0} className="mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-8">
        <Typography variant="h4" className="font-bold text-gray-900">
          Related Articles
        </Typography>
        <TrendingUp className="text-blue-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card 
            key={post.id} 
            className="group hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 rounded-xl overflow-hidden"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {post.trending && (
                  <div className="absolute top-3 left-3">
                    <Chip
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="Trending"
                      size="small"
                      className="bg-orange-100 text-orange-700 font-medium"
                    />
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {formatViews(post.views)} views
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      className={`text-xs font-medium ${
                        tags.includes(tag) 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    />
                  ))}
                  {post.tags.length > 2 && (
                    <Chip
                      label={`+${post.tags.length - 2}`}
                      size="small"
                      className="bg-gray-100 text-gray-500 text-xs"
                    />
                  )}
                </div>
                
                <Typography
                  variant="h6"
                  className="font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
                >
                  {post.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  className="text-gray-600 mb-4 line-clamp-3 leading-relaxed"
                >
                  {post.excerpt}
                </Typography>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{formatDate(post.publishedAt)}</span>
                  <div className="flex items-center space-x-1">
                    <AccessTime className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <Box className="mt-8 text-center">
        <Link 
          href="/blog" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          View All Articles
        </Link>
      </Box>
    </Paper>
  );
}