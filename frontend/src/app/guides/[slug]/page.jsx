import { notFound } from 'next/navigation';
import Link from 'next/link';
import publicAxiosServer from '../../../lib/publicApiServer';

// Utility to format links
function formatUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '') + u.pathname;
  } catch {
    return url;
  }
}

// Server-side fetch with pagination support
async function getGuide(slug, page = 1, limit = 10) {
  try {
    const res = await publicAxiosServer.get(`/guides/${slug}`, {
      params: { page, limit },
    });
    return res?.data?.data || null;
  } catch (err) {
    console.error('[getGuide error]', err.response?.data || err.message);
    return null;
  }
}

// Server-side get guide meta
export async function generateMetadata({ params }) {
  const guide = await getGuide(params.slug, 1, 1); // fetch for title/desc only
  if (!guide) return { title: 'Guide Not Found' };
  return {
    title: guide.title ? `${guide.title} | Guide` : 'Guide Table',
    description: guide.description || '',
    alternates: { canonical: `/dashboard/guides/${params.slug}` },
  };
}

// Pagination component
function Pagination({ page, totalPages, getPageHref }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="flex justify-end gap-2 mt-6">
      <Link
        href={getPageHref(page - 1)}
        className={`px-3 py-1.5 rounded ${page <= 1 ? 'pointer-events-none bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
        aria-disabled={page <= 1}
      >
        Previous
      </Link>
      <span className="px-3 py-1.5">{page} / {totalPages}</span>
      <Link
        href={getPageHref(page + 1)}
        className={`px-3 py-1.5 rounded ${page >= totalPages ? 'pointer-events-none bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
        aria-disabled={page >= totalPages}
      >
        Next
      </Link>
    </nav>
  );
}

export default async function GuideDetailPage({ params, searchParams }) {
  // Get pagination from search params
  const page = Math.max(1, parseInt(searchParams?.page, 10) || 1);
  const limit = Math.max(1, parseInt(searchParams?.limit, 10) || 10);

  const guide = await getGuide(params.slug, page, limit);

  if (!guide) {
    notFound();
  }

  // If your API response is { data: { ...guide, rows, totalRows, totalPages } }
  const rows = guide.rows || [];
  const totalRows = guide.totalRows || rows.length;
  const totalPages = guide.totalPages || Math.max(1, Math.ceil(totalRows / limit));

  // Helper for pagination links (keeps limit param)
  const getPageHref = (p) => `/dashboard/guides/${params.slug}?page=${p}&limit=${limit}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      <section className="max-w-3xl mx-auto bg-white border border-blue-200 rounded-2xl shadow-lg px-8 py-10 mt-10">
        <div className="flex items-center mb-8">
          <Link
            href="/guides"
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium shadow-sm transition"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go back
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2">{guide.title}</h1>
        {guide.description && (
          <p className="mb-8 text-lg text-gray-700">{guide.description}</p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-white">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="px-4 py-3 text-left text-blue-900 font-semibold text-base">Purpose</th>
                <th className="px-4 py-3 text-left text-blue-900 font-semibold text-base">Guide</th>
                <th className="px-4 py-3 text-left text-blue-900 font-semibold text-base">Link</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60'} hover:bg-blue-100/50`}
                  >
                    <td className="px-4 py-3 text-gray-900 align-top max-w-xs break-words">
                      {row.purpose}
                    </td>
                    <td className="px-4 py-3 text-gray-700 align-top max-w-md break-words">
                      {row.guide}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {row.link ? (
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          title={row.link}
                        >
                          <span>Visit</span>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m-1.5-5.5L10 14m-3 6h-5v-5l13-13"/></svg>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No link</span>
                      )}
                      {row.link && (
                        <div className="text-xs text-blue-700 mt-1 truncate max-w-[160px]">
                          {formatUrl(row.link)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">No rows</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} getPageHref={getPageHref} />
      </section>
    </main>
  );
}