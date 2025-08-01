import mongoose from "mongoose";
import { DB_URL, PORT } from "./app/config/index.js";
import app from "./app.js";
import http from "http";

async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected");

    const server = http.createServer(app);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}!`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();