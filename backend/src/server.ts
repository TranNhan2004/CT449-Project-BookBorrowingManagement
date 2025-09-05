import mongoose from "mongoose";
import { appConfig } from "./app/config/index";
import { app } from "./app/app";

async function startServer() {
    try {
        await mongoose.connect(appConfig.db.url);
        console.log(`Connected to MongoDB database at ${appConfig.db.url} successfully!`);

        app.listen(appConfig.app.port, () => {
            console.log(`Server is running on port ${appConfig.app.port}`);
        });
    } catch (err) {
        console.error(`Error starting server: ${(err as Error).message}`);
        process.exit(1);
    }
}

startServer();
