// pages/api/stories/index.js
import clientPromise from '../../../lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = session.user.sub;

  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('story-app');
      const storiesCollection = db.collection('stories');
      const stories = await storiesCollection
        .find({ $or: [ { userId }, { userId: { $exists: false } } ] })
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json({ stories });
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      return res.status(500).json({ message: 'Failed to fetch stories', error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const client = await clientPromise;
      const db = client.db('story-app');
      const storiesCollection = db.collection('stories');
      
      const newStoryDocument = {
        userId,
        title,
        description,
        characterIds: [],
        createdAt: new Date(),
      };

      const result = await storiesCollection.insertOne(newStoryDocument);

      const createdStory = {
        ...newStoryDocument,
        _id: result.insertedId,
      };
      
      return res.status(201).json({ message: 'Story created successfully!', story: createdStory });

    } catch (error) {
      console.error('Failed to create story:', error);
      return res.status(500).json({ message: 'Failed to create story', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}