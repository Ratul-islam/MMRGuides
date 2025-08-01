'use client';

import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { 
  ThumbUp, 
  ThumbUpOutlined, 
  Reply, 
  MoreVert,
  EmojiEmotions,
  Send
} from '@mui/icons-material';

const mockComments = [
  {
    id: 1,
    author: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c3?w=80&h=80&fit=crop&crop=face",
      verified: true
    },
    content: "Excellent article! The section on Server Components really helped clarify some concepts I was struggling with. The examples are spot-on and very practical.",
    publishedAt: "2025-07-31T14:30:00Z",
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: 2,
        author: {
          name: "Mike Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
          verified: false
        },
        content: "Totally agree! I've been using Server Components in production and the performance improvements are noticeable. Great write-up!",
        publishedAt: "2025-07-31T15:45:00Z",
        likes: 8,
        isLiked: true
      }
    ]
  },
  {
    id: 3,
    author: {
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      verified: true
    },
    content: "The WebAssembly section was particularly insightful! I'm curious about the performance benchmarks you mentioned. Do you have any specific numbers to share?",
    publishedAt: "2025-07-31T16:20:00Z",
    likes: 15,
    isLiked: false,
    replies: []
  },
  {
    id: 4,
    author: {
      name: "James Kumar",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      verified: false
    },
    content: "As someone who's been in web dev for 15+ years, it's amazing to see how far we've come. The AI tools mentioned here are game-changers for productivity.",
    publishedAt: "2025-07-31T13:15:00Z",
    likes: 31,
    isLiked: true,
    replies: []
  }
];

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId
              ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
              : reply
          )
        };
      } else if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: {
          name: "You",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face",
          verified: false
        },
        content: newComment,
        publishedAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replies: []
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId) => {
    if (replyText.trim()) {
      // In a real app, submit reply to your API
      setReplyTo(null);
      setReplyText('');
    }
  };

  const totalComments = comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    } else if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0;
  });

  return (
    <Paper elevation={0} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Typography variant="h5" className="font-semibold text-gray-900">
          Comments ({totalComments})
        </Typography>
        
        <div className="flex items-center space-x-2">
          <Typography variant="body2" className="text-gray-600">Sort by:</Typography>
          {['newest', 'oldest', 'popular'].map((option) => (
            <Chip
              key={option}
              label={option.charAt(0).toUpperCase() + option.slice(1)}
              onClick={() => setSortBy(option)}
              variant={sortBy === option ? "filled" : "outlined"}
              size="small"
              className={sortBy === option ? "bg-blue-600 text-white" : ""}
            />
          ))}
        </div>
      </div>
    </Paper>
  );
}