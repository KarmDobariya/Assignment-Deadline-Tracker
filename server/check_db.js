import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/assignment-tracker').then(async () => {
  const users = await User.find({});
  console.log('--- ALL USERS ---');
  console.log(users);
  process.exit(0);
});
