import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';

const adventureSchema = new Schema({

});

export const AdventureModel = mongoose.model('Adventure', adventureSchema);