import mongoose from "mongoose";
import app from "./app";
import { DB_URI, PORT } from "./config/config";

export async function main() {
  try {
    if(DB_URI)
    await mongoose
      .connect(DB_URI)
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
