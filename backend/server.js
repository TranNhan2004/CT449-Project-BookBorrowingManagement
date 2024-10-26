const app = require('./app');
const config = require('./app/config');
const mongoose = require('mongoose');

async function startServer() {
    try {
        await mongoose.connect(config.db.uri);
        console.log(`Connected to MongoDB database at ${config.db.uri} successfully!`);
        
        app.listen(config.app.port, () => {
            console.log(`Server is running on port ${config.app.port}`);
        });
    } catch (err) {
        console.error(`Error starting server: ${err.message}`);
        process.exit(1);
    }
}

startServer();