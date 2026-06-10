import mongoose from "mongoose";

const connectDB = async () => {
  // DB_NAME defaults to "prescripto" — existing data lives there, change only via .env
  const dbName = process.env.DB_NAME || "prescripto";

  mongoose.connection.on("connected", () =>
    console.log(`Database connected — ${dbName}`),
  );

  await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
};

export default connectDB;
