import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import publicAxios from '../../lib/publicApi';

const RecentGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await publicAxios.get('/guides');
        if (!response?.data) throw new Error('Invalid API response format');
        setGuides(response.data.data);
      } catch (err) {
        setError(err.message || 'Error fetching guides');
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading guides...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Guides</h2>
            <p className="text-gray-600 mt-1">
              {guides.length} guide{guides.length !== 1 && 's'} available
            </p>
          </div>
          <Link
            href="/guides"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {guides.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Title</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Description</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody>
                {guides.slice(0, 8).map((guide, idx) => (
                  <motion.tr
                    key={guide._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`border-t border-gray-100 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60'
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{guide.title}</td>
                    <td className="px-4 py-3 text-gray-600">{guide.description}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/guides/${guide._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      >
                        View
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="ml-1">
                          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m-1.5-5.5L10 14m-3 6h-5v-5l13-13"/>
                        </svg>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600">No guides available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentGuides;