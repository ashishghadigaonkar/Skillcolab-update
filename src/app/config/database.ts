export const databaseConfig = {
  uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillcollab",
  options: {
    maxPoolSize: 100,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};
