import mongoose from "mongoose";

const connectDatabase = async () => {
  const connection = await mongoose.connect(process.env.databaseUrl);
  console.log(`Database Connection Successful`);
};

export default connectDatabase;
