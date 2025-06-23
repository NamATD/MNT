import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/task-management');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;