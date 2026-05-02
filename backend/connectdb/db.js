const mongoose = require('mongoose');

const Connectdb = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Jobseekingplatform';
        
        // Simple connection without deprecated options
        await mongoose.connect(mongoURI);
        
        console.log('✅ Connected to MongoDB successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        
        // Log specific connection issues
        if (error.message.includes('authentication failed')) {
            console.error('🔐 Authentication failed - check your username/password');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('🔌 Connection refused - MongoDB server not running');
            console.error('💡 Try: Download and install MongoDB from https://www.mongodb.com/try/download/community');
        } else if (error.message.includes('timeout')) {
            console.error('⏰ Connection timeout - check your network or MongoDB status');
        }
        
        // Don't exit in development for easier debugging
        console.log('🔄 Server will continue running without database...');
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB');
});

module.exports = Connectdb;