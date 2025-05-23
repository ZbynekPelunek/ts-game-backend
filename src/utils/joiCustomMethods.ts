import { isValidObjectId } from 'mongoose';

export const validObjectIdCheck = (value: string) => {
  if (!isValidObjectId(value)) {
    throw new Error('ID must be valid Mongoose Object ID.');
  }
  return value;
};
