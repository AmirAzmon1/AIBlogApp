import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';

function CharactersPage({ characters }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Characters</h1>
        <Link href="/characters/create" className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">Create Character</Link>
      </div>

      {(!characters || characters.length === 0) ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-600">No characters yet. Create your first one!</div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {characters.map((c) => (
            <li key={c._id} className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.description}</p>
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
    const url = baseUrl ? `${baseUrl}/api/characters` : `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/api/characters`;
    const response = await fetch(url, { headers: { cookie: req.headers.cookie || '' } });
    if (!response.ok) {
      return { props: { characters: [] } };
    }
    const data = await response.json();
    return { props: { characters: data.characters || [] } };
  },
});

export default CharactersPage;


