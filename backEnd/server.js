import mongoose from "mongoose";
import app from "./app.js";
import { DB_URI, PORT } from "./config/config.js";

export async function main() {
  try {
    mongoose
      .connect(DB_URI, { useNewUrlParser: true })
      .then(() => console.log("🍃 MongoDB successfully connected!"))
      .catch((err) => console.log(err));

    app.listen(PORT, () =>
      console.log(`📡 Server up and running on port ${PORT} !`)
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
main();
