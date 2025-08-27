// pages/api/stories/[id].js
import { ObjectId } from 'mongodb'; // חשוב לייבא את ObjectId
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  // קוראים את ה-ID של הסיפור מהכתובת
  const { id: storyId } = req.query;

  // אנחנו רוצים לעדכן סיפור, ולכן נשתמש בשיטת PATCH
  if (req.method === 'PATCH') {
    try {
      // קוראים את ה-ID של הדמות מהבקשה
      const { characterId } = req.body;

      if (!characterId) {
        return res.status(400).json({ message: 'Character ID is required' });
      }

      const client = await clientPromise;
      const db = client.db('story-app');
      const storiesCollection = db.collection('stories');
      
      // הפעולה המרכזית: עדכון הסיפור
      const result = await storiesCollection.updateOne(
        { _id: new ObjectId(storyId) }, // 1. מצא את הסיפור עם ה-ID הזה
        { $push: { characterIds: new ObjectId(characterId) } } // 2. דחוף למערך characterIds את ה-ID של הדמות
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Story not found' });
      }

      return res.status(200).json({ message: 'Character added to story successfully!' });

    } catch (error) {
      console.error('Failed to add character to story:', error);
      return res.status(500).json({ message: 'Failed to add character to story', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}