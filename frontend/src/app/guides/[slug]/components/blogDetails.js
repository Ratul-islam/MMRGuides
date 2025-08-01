'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  IconButton,
  Tooltip,
  Fab,
  Typography,
  Container,
  Button
} from '@mui/material';
import {
  Share,
  Bookmark,
  BookmarkBorder,
  ThumbUp,
  ThumbUpOutlined,
  ArrowBack,
  KeyboardArrowUp,
  Visibility
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github.css';
import { cleanContent, isHtmlContent } from '../../../../lib/markDownCleanup';

export default function BlogDetailsClient({ post }) {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const processedContent = cleanContent(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Container maxWidth="lg">
          <div className="flex items-center justify-between h-16">
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              variant="text"
              className="text-gray-600 hover:text-gray-900"
            >
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              <Tooltip title="Bookmark">
                <IconButton 
                  onClick={handleBookmark} 
                  size="small"
                  className={isBookmarked ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}
                >
                  {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Share">
                <IconButton 
                  onClick={handleShare}
                  size="small"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Container>
      </header>

      <Container maxWidth="lg" className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Meta Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-1">
                <Visibility className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
              <span>•</span>
              <time>{formatDate(post.publishedAt)}</time>
              <span>•</span>
              <span>{calculateReadTime(post.content)}</span>
              {post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span>Updated {formatTimeAgo(post.updatedAt)}</span>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag.replace('-', ' ')}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
              {post.excerpt}
            </p>

          </header>

          {/* Featured Image */}
          {post.featuredImage !==null&&
          <div className="mb-12">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
}
          {/* Article Content */}
          <article className="prose prose-lg prose-gray max-w-none mb-12">
            {isHtmlContent(processedContent) ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  rehypeSanitize,
                  rehypeHighlight
                ]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 mt-12 mb-6 pb-4 border-b border-gray-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                      {children}
                    </h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-base font-semibold text-gray-900 mt-4 mb-2">
                      {children}
                    </h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-sm font-semibold text-gray-900 mt-4 mb-2">
                      {children}
                    </h6>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-400 transition-colors"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6 ml-6 list-disc">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-6 ml-6 list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 leading-relaxed">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-200 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg">
                      <div className="text-gray-700 italic">
                        {children}
                      </div>
                    </blockquote>
                  ),
                  code: ({ inline, children }) => (
                    inline ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm">
                        {children}
                      </code>
                    )
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-8">
                      {children}
                    </pre>
                  ),
                  img: ({ src, alt }) => (
                    <Image
                      src={src}
                      alt={alt || ''}
                      width={800}
                      height={400}
                      className="w-full h-auto rounded-lg shadow-md my-8"
                    />
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2">
                      {children}
                    </td>
                  ),
                  // Handle bold text
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  b: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  // Handle italic text
                  em: ({ children }) => (
                    <em className="italic text-gray-700">
                      {children}
                    </em>
                  ),
                  i: ({ children }) => (
                    <em className="italic text-gray-700">
                      {children}
                    </em>
                  ),
                }}
              >
                {processedContent}
              </ReactMarkdown>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {processedContent}
              </ReactMarkdown>
            )}
          </article>

        </div>
      </Container>

      {/* Scroll to Top */}
      {showScrollTop && (
        <Fab
          onClick={scrollToTop}
          size="medium"
          className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white"
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </div>
  );
}