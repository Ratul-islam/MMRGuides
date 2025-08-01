"use client"
import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import publicAxios from '../../../lib/publicApi';


import SearchAndFilters from './SearchAndFilter';
import GuidesGrid from './GuidesGrid';
import LoadingState from '../../../shared/loadingAndError/LoadingState';
import EmptyState from '../../../shared/loadingAndError/ErrorState';
import Pagination from '../../../shared/pagination/pagination';

// Hooks
import { useDebounce } from '../../../hooks/useDebounce';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

// Utils
import { getCategories, filterAndSortGuides } from '../../../lib/guidUtils';

const GuidesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [viewMode, setViewMode] = useLocalStorage('guidesViewMode', 'grid');
  
  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Categories from guides
  const categories = useMemo(() => getCategories(guides), [guides]);
  
  // Filtered and sorted guides
  const filteredAndSortedGuides = useMemo(() => 
    filterAndSortGuides(guides, debouncedSearchTerm, activeFilter, sortBy),
    [guides, debouncedSearchTerm, activeFilter, sortBy]
  );

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (activeFilter !== 'All') params.set('category', activeFilter);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    const paramString = params.toString();
    const newUrl = paramString ? `/guides?${paramString}` : '/guides';
    
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl, { shallow: true });
    }
  }, [debouncedSearchTerm, activeFilter, sortBy, router]);

  // Fetch guides from API
  const fetchGuides = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        published: 'true'
      });

      const response = await publicAxios.get(`/posts?${params}`);
      
      if (!response.data?.success) {
        throw new Error('Failed to fetch guides');
      }
      
      const { posts, total, page: currentPage, pages } = response.data.data;
      const publishedGuides = posts.filter(post => post.published);
      
      if (append) {
        setGuides(prev => [...prev, ...publishedGuides]);
      } else {
        setGuides(publishedGuides);
      }
      
      setPagination({ total, page: currentPage, pages });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load more guides
  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.pages && !loadingMore) {
      fetchGuides(pagination.page + 1, true);
    }
  }, [pagination.page, pagination.pages, loadingMore, fetchGuides]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setActiveFilter('All');
    setSortBy('newest');
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Development Guides - Loading...</title>
        </Head>
        <LoadingState />
      </>
    );
  }


  return (
    <>
      <Head>
        <title>Development Guides | {guides.length} Expert Tutorials</title>
        <meta name="description" content={`Browse ${guides.length} comprehensive development guides covering React, JavaScript, Python, AI, and more. Learn from expert tutorials and advance your coding skills.`} />
        <meta name="keywords" content="development guides, programming tutorials, React, JavaScript, Python, AI, machine learning, web development" />
        <meta property="og:title" content={`${guides.length} Development Guides | Expert Programming Tutorials`} />
        <meta property="og:description" content="Comprehensive collection of expert-crafted tutorials covering modern web development, AI, and cutting-edge technologies." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/guides" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={categories}
          totalResults={filteredAndSortedGuides.length}
          totalGuides={guides.length}
        />

        {filteredAndSortedGuides.length === 0 ? (
          <EmptyState
            searchTerm={debouncedSearchTerm}
            activeFilter={activeFilter}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <>
            <GuidesGrid
              guides={filteredAndSortedGuides}
              viewMode={viewMode}
            />
            
            {pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onLoadMore={handleLoadMore}
                loading={loadingMore}
              />
            )}
          </>
        )}

      </main>
    </>
  );
};

export default GuidesPage;