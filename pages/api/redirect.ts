import { ObjectID } from 'mongodb';
import { connectToDatabase } from "./_connector";

// we are trying to find a link by its id in our database
// if we find it, we redirect the user to the right location
// if the system fails to find it, we will redirect the user to the main page

export default async (req, res) => {
  const db = await connectToDatabase();

  const entry = await db.db('links_db').collection('links_collection').findOne({ _id: new ObjectID(req.query.id as string) });

    if (entry !== null) {
        return res.redirect(301, entry.link);
    }

    return res.redirect(301, '/');
}