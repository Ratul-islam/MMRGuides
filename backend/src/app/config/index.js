import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
// export env variable
const NODE_ENV = process.env.NODE_ENV;
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
// const STORE_ID = process.env.STORE_ID;
// const STORE_KEY = process.env.STORE_KEY;
const BASE_URL = process.env.BASE_URL;

export {
  NODE_ENV,
  DB_URL,
  PORT,
  SECRET,
  EMAIL_PASS,
  EMAIL_USER,
  // STORE_ID,
  // STORE_KEY,
  BASE_URL,
};