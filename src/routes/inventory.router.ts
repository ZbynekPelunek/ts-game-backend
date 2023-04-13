import express, { Request, Response } from 'express';

import {
  Request_Inventories_GET_one_params,
  Request_Inventories_POST_body,
  Response_Inventories_GET_one,
  Response_Inventories_POST,
} from '../../../shared/src';


export const inventoriesRouter = express.Router();

// inventoriesRouter.get('/:inventoryId', async (req: Request<Request_Inventories_GET_one_params>, res: Response<Response_Inventories_GET_one>) => {
//   const { inventoryId } = req.params;

//   const inventory = await InventoryModel.findById(inventoryId).exec();
//   if (!inventory) {
//     return res.status(404).json({ success: false, error: `Inventory with id ${inventoryId} not found` });
//   }
//   const responseInventory = {
//     inventoryId: inventory._id.toString(),
//     slots: inventory.slots
//   }

//   return res.status(200).json({ success: true, inventory: responseInventory });
// })

// inventoriesRouter.post('', async (req: Request<{}, {}, Request_Inventories_POST_body>, res: Response<Response_Inventories_POST>) => {
//   const { characterId } = req.body;

//   const inventory = new InventoryModel();
//   inventory.characterId = characterId;

//   await inventory.save();

//   return res.status(201).json({ success: true, inventory: { inventoryId: inventory._id.toString() } });
// });