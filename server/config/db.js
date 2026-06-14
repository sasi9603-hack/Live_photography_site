import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.log('--- WARNING: MONGO_URI missing from .env. Running in In-Memory Local Database Mode. ---');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('--- FALLBACK: Reverting to In-Memory Local Database Mode. ---');
    isConnected = false;
    return false;
  }
};

export { connectDB, isConnected };
export default connectDB;
