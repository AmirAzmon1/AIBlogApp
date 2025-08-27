import '../styles/globals.css'
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

function AppShell({ children }) {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">Story Maker</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link href="/characters" className="hover:text-blue-600">Characters</Link>
            <Link href="/stories" className="hover:text-blue-600">Stories</Link>
            {!user && (
              <a href="/api/auth/login" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">Login</a>
            )}
            {user && (
              <a href="/api/auth/logout" className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-white hover:bg-black">Logout</a>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </UserProvider>
  );
}

export default MyApp
