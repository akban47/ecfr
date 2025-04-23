import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function saveHistoricalChanges(
  titleNumber: number, 
): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db('ecfr_analyzer');
    
    await db.collection('historical_changes').updateOne(
      { titleNumber },
      { 
        $set: { 
          titleNumber,
          lastUpdated: new Date().toISOString()
        }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving historical changes:', error);
    throw error;
  }
}