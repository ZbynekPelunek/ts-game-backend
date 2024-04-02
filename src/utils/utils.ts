import { Types } from 'mongoose';

//TODO: make it actually useful
export const validateObjectId = (id: string): boolean => {
  try {
    console.log('checking id: ', id);
    return id.toString() === new Types.ObjectId(id).toString();
  } catch (error) {
    console.log(`ID: ${id} is not correct OBject ID`);
    return false;
  }
};
