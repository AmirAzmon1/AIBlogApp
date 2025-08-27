// pages/api/characters.js
import clientPromise from '../../lib/mongodb';
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
      const charactersCollection = db.collection('characters');
      const characters = await charactersCollection
        .find({ $or: [ { userId }, { userId: { $exists: false } } ] })
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json({ characters });
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      return res.status(500).json({ message: 'Failed to fetch characters', error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, imageUrl } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Character name is required' });
      }

      const client = await clientPromise;
      const db = client.db('story-app');
      const charactersCollection = db.collection('characters');

      const newCharacterDocument = {
        userId,
        name,
        description,
        imageUrl: imageUrl || null,
        createdAt: new Date(),
      };

      const result = await charactersCollection.insertOne(newCharacterDocument);

      const createdCharacter = {
        ...newCharacterDocument,
        _id: result.insertedId,
      };

      return res.status(201).json({ message: 'Character created successfully!', character: createdCharacter });

    } catch (error) {
      console.error('Failed to create character:', error);
      return res.status(500).json({ message: 'Failed to create character', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}