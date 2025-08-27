// pages/dashboard.js
import { useUser } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';

function Dashboard() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <img src={user.picture} alt={user.name} height={64} width={64} className="rounded-full" />
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.nickname}!</h1>
          <p className="text-gray-600">Create characters and stories from here.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/stories/create" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition block">
          <h2 className="text-lg font-semibold">Create a New Story</h2>
          <p className="text-sm text-gray-600 mt-1">Open the story creator page</p>
          <span className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white">Start →</span>
        </Link>
        <Link href="/characters/create" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition block">
          <h2 className="text-lg font-semibold">Create a New Character</h2>
          <p className="text-sm text-gray-600 mt-1">Open the character creator page</p>
          <span className="mt-4 inline-flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-white">Start →</span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/characters" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">My Characters</h3>
              <p className="text-sm text-gray-600">View and manage your characters</p>
            </div>
            <span className="text-blue-600">Open →</span>
          </div>
        </Link>
        <Link href="/stories" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">My Stories</h3>
              <p className="text-sm text-gray-600">Browse all your stories</p>
            </div>
            <span className="text-blue-600">Open →</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();

export default Dashboard;