import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';

function StoriesPage({ stories }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Stories</h1>
        <Link href="/stories/create" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create Story</Link>
      </div>

      {(!stories || stories.length === 0) ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-600">No stories yet. Create your first one!</div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {stories.map((s) => (
            <li key={s._id} className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="font-medium">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const url = baseUrl ? `${baseUrl}/api/stories` : `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/api/stories`;
    const response = await fetch(url, { headers: { cookie: req.headers.cookie || '' } });
    if (!response.ok) {
      return { props: { stories: [] } };
    }
    const data = await response.json();
    return { props: { stories: data.stories || [] } };
  },
});

export default StoriesPage;


