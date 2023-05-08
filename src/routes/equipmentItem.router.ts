import express, { Request, Response } from 'express';

import { EquipmentItemModel } from '../schema/equipmentItem.schema';

export const equipmentItemsRouter = express.Router();

equipmentItemsRouter.get('', async (req: Request<{}, {}, {}, { characterId: string }>, res: Response) => {
  const { characterId } = req.query;

  const equipmentItems = await EquipmentItemModel.find({ characterId });

  return res.status(200).json({ success: true, equipmentItems });
})
