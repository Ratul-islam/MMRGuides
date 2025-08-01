import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogDetailsClient from './components/blogDetails';
import BlogDetailsSkeleton from './components/BlogDetailsSkeleton';
import { getBlogPost, getAllBlogSlugs } from '../../../lib/blog';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const post = await getBlogPost(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found'
      };
    }

    return {
      title: `${post.title} | Tech Blog`,
      description: post.excerpt,
      keywords: post.tags.join(', '),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 600,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage],
      },
      alternates: {
        canonical: `/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Tech Blog',
      description: 'Read the latest insights and trends in web development.'
    };
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  
  try {
    const post = await getBlogPost(slug);
    
    if (!post) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<BlogDetailsSkeleton />}>
          <BlogDetailsClient post={post} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}