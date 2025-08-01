import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function getBlogPost(slug) {
  try {
    const response = await api.get(`/posts/${slug}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }
}

export async function getAllBlogSlugs() {
  try {
    const response = await api.get('/posts');
    const posts = response.data.success ? response.data.data : response.data;
    
    return posts.posts
      .filter(post => post.published)
      .map(post => post.slug);
  } catch (error) {
    console.error('Failed to fetch blog slugs:', error);
    return [];
  }
}