import 'dotenv/config';
import mongoose from 'mongoose';
import { REWARDS } from '../data/rewards';
import { RewardModel } from '../models/reward.model';

const uri = process.env.MONGOOSE_URI_DEV;

const rewardsData = REWARDS;

async function connect() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');

    await RewardModel.deleteMany({});
    await RewardModel.insertMany(rewardsData);
    console.log('seeding rewards done');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connect();
