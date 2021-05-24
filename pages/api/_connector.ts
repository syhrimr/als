import { MongoClient } from 'mongodb';

let cachedDb;

export async function connectToDatabase() {
    // checks if the connection to the database exists
    if (cachedDb) {
        return cachedDb;
    }
    
    // if it doesn't this code will establish it
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    cachedDb = client;
    return await client.connect();
}