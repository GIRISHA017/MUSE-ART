import mongoose from 'mongoose';
import { Artwork } from '../models/Admin/Additem.js';
import { INITIAL_ARTWORKS, INITIAL_USER_VAULT } from './data.js';

export async function connectDB() {
  let uri = process.env.MONGO_URI;
  
  console.log(`[DB DEBUG] MONGO_URI length: ${uri?.length || 0}`);
  if (uri) {
    console.log(`[DB DEBUG] MONGO_URI prefix: ${uri.substring(0, 15)}...`);
  }

  if (!uri || uri.trim() === '') {
    console.error('CRITICAL: MONGO_URI is not defined or is empty.');
    return;
  }

  // Strip potential MONGO_URI= prefix if user pasted the whole line
  if (uri.startsWith('MONGO_URI=')) {
    uri = uri.replace('MONGO_URI=', '').trim();
  }

  // Strip potential quotes (single or double) from the URI string
  uri = uri.replace(/^['"]|['"]$/g, '').trim();

  // Extract username for debugging and placeholder detection
  let username = '';
  try {
    const urlParts = uri.split('://')[1];
    const credentials = urlParts.split('@')[0];
    username = credentials.split(':')[0];
  } catch (e) {
    // Ignore parsing errors
  }

  // Detect placeholder URIs and skip connection
  if (uri.includes('MONGODB_URI:') || uri.includes('<db_password>') || username === 'MONGODB_URI' || username === 'your-username') {
    console.warn('[DB WARNING] MONGODB_URI appears to contain placeholder values. Skipping database connection.');
    console.warn('Please update your .env file with the correct MongoDB URI to enable database features.');
    return;
  }

  if (uri.length < 20 || (!uri.includes('://') && !uri.includes('@'))) {
    console.warn(`[DB WARNING] MONGODB_URI looks like a secret/password instead of a full URI.`);
    console.warn('It should start with "mongodb://" or "mongodb+srv://".');
    return;
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.warn(`[DB WARNING] MONGODB_URI has an invalid scheme. Current prefix: ${uri.substring(0, 10)}...`);
    return;
  }

  // Log username for debugging (Safe logging)
  console.log(`[DB DEBUG] Attempting connection with username: "${username}"`);

  try {
    // Add a strict timeout to prevent hanging the event loop if the host is unreachable
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    };
    
    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB');
    await seedDB();
  } catch (error) {
    console.error('MongoDB connection error (check your MONGODB_URI):', error.message);
  }
}

async function seedDB() {
  try {
    const count = await Artwork.countDocuments();
    if (count === 0) {
      console.log('Seeding initial artworks...');
      
      const artworks = INITIAL_ARTWORKS.map(a => ({ ...a, isUserOwned: false }));
      const vaultItems = INITIAL_USER_VAULT.map(v => ({ ...v, isUserOwned: true }));
      
      await Artwork.insertMany([...artworks, ...vaultItems]);
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
}
