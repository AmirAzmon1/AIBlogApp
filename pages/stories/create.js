import { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

function CreateStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      router.push('/stories');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Create Story</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create</button>
          <button type="button" onClick={() => router.back()} className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-gray-50">Cancel</button>
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
export default CreateStoryPage;


