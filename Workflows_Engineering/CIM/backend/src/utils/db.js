const mongoose = require('mongoose');
async function connectDB(){
  const uri = process.env.MONGO_URI;
  if(!uri) throw new Error('MONGO_URI missing');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, family: 4, tls: true });
  return mongoose.connection;
}
module.exports = { connectDB };
