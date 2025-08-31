// pages/api/characters/[characterId].js
import clientPromise from '../../../lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = session.user.sub;
  const { characterId } = req.query;

  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('story-app');
      const charactersCollection = db.collection('characters');
      
      const character = await charactersCollection.findOne({ 
        _id: new ObjectId(characterId),
        $or: [{ userId }, { userId: { $exists: false } }]
      });
      
      if (!character) {
        return res.status(404).json({ message: 'Character not found' });
      }
      
      return res.status(200).json({ character });
    } catch (error) {
      console.error('Failed to fetch character:', error);
      return res.status(500).json({ message: 'Failed to fetch character', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db('story-app');
      const charactersCollection = db.collection('characters');
      
      // Only allow deletion if user owns the character or if it has no userId
      const result = await charactersCollection.deleteOne({ 
        _id: new ObjectId(characterId),
        $or: [{ userId }, { userId: { $exists: false } }]
      });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Character not found or not authorized to delete' });
      }
      
      return res.status(200).json({ message: 'Character deleted successfully' });
    } catch (error) {
      console.error('Failed to delete character:', error);
      return res.status(500).json({ message: 'Failed to delete character', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
