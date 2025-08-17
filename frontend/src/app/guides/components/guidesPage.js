"use client";
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import publicAxios from '../../../lib/publicApi';

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <span className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
    <span className="ml-3 text-gray-600">Loading guides...</span>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">📝</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No guides found</h3>
    <p className="text-gray-600">No guides available yet.</p>
  </div>
);

const GuideCard = ({ guide, onVisit }) => (
  <div
    className="group bg-white border border-gray-200 rounded-xl px-6 py-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between shadow transition-shadow hover:shadow-md"
  >
    <div>
      <div className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition">{guide.title}</div>
      {guide.description && (
        <div className="text-gray-600 text-sm line-clamp-2 max-w-xl">{guide.description}</div>
      )}
    </div>
    <div className="mt-4 md:mt-0 md:ml-10 flex-shrink-0">
      <button
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white text-sm font-medium rounded-lg shadow-sm transition"
        onClick={() => onVisit(guide._id)}
        type="button"
        aria-label={`Visit ${guide.title}`}
      >
        Visit
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  </div>
);

const GuidesPage = () => {
  const router = useRouter();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guides
  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      const response = await publicAxios.get('/guides');
      if (!response.data?.data) throw new Error('Failed to fetch guides');
      setGuides(response.data.data);
    } catch (err) {
      setError(err.message || 'Error fetching guides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleVisit = (id) => {
    router.push(`/guides/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Guides - Loading...</title>
        </Head>
        <LoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Guides - Error</title>
        </Head>
        <div className="flex items-center justify-center min-h-[200px] text-red-600">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Guides | Quick Browse</title>
        <meta name="description" content={`Browse ${guides.length} guides. Each shows a title, short description, and a visit button.`} />
        <link rel="canonical" href="/guides" />
      </Head>
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 py-1 transition"
            aria-label="Go back"
            type="button"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-9 tracking-tight">Guides</h1>
          {guides.length === 0 ? (
            <EmptyState />
          ) : (
            guides.map(guide => (
              <GuideCard guide={guide} key={guide._id} onVisit={handleVisit} />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default GuidesPage;