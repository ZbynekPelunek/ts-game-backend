import express, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { EquipmentItemBackend, EquipmentSlot } from '../../../shared/src';
import { EquipmentItemModel } from '../schema/equipmentItem.schema';

export const equipmentItemsRouter = express.Router();

equipmentItemsRouter.get('', async (req: Request<{}, {}, {}, { characterId: string }>, res: Response) => {
  const { characterId } = req.query;

  const equipmentItems = await EquipmentItemModel.find({ characterId });

  return res.status(200).json({ success: true, equipmentItems });
})

// equipmentItemsRouter.post('', async (req: Request<{}, {}, { characterId: string }>, res: Response) => {
//   const { characterId } = req.body;

//   const equipmentArr = [];
//   for (const e in EquipmentSlot) {
//     const equipmentObj: EquipmentItemBackend = {
//       characterId: new Types.ObjectId(characterId),
//       equipmentSlot: e as EquipmentSlot
//     }
//     equipmentArr.push(equipmentObj);
//   }

//   const createEquipmentResponse = await EquipmentItemModel.create(equipmentArr);

//   const equipmentIds = createEquipmentResponse.map(e => e._id);

//   return res.status(201).json({ success: true, equipmentIds });
// })