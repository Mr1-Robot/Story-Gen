import mongoose from "mongoose";

export default async function dbConnect() {
  // mongoose.set("strictQuery", true);

  const DATABASE_URL = process.env.DATABASE_URL!;

  if (!DATABASE_URL) {
    return console.error("DATABASE_URL is missing or invalid.");
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return console.log("DB already connected.");
    }

    await mongoose.connect(DATABASE_URL, {
      dbName: "story_gen",
    });

    return console.log("DB connected sucessfully.");
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong with DB connection!");
  }
}
