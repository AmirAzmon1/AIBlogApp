import { useRouter } from 'next/router';

const CharacterPage = () => {
  const router = useRouter();
  const { characterId } = router.query;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Character {characterId}</h1>
      <p className="text-gray-600 mt-2">This page will show character details.</p>
      <button onClick={() => router.push('/characters')} className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Back to Characters
      </button>
    </div>
  );
};

export default CharacterPage;