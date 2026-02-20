import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(process.env.MONGO_URI);
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('❌ MongoDB Connection Failed');
        process.exit(1);
    }
};

export default connectDB;