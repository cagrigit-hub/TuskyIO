import { app } from "./app";
import pclient from "./services/pclient";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.PG_HOST) {
    throw new Error("PG_HOST must be defined");
  }
  pclient.connect();
  // create a table if it doesn't exist
  await pclient.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT NOT NULL, password TEXT NOT NULL)"
  );
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
