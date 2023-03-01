import { Client } from "pg";
const pclient = new Client({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT!),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

export default pclient;
