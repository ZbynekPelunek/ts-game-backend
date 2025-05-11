import {
  CharacterEquipmentBackend,
  CharacterEquipmentFrontend,
  EquipmentSlot,
  ListCharacterEquipmentsRequestQuery
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler.middleware';
import { CharacterEquipmentModel } from '../models/characterEquipment.model';

export class CharacterEquipmentService {
  async listCharacterEquipment(
    queryParams: ListCharacterEquipmentsRequestQuery
  ) {
    const { characterId, itemSlot, populateItem } = queryParams;
    const charEquipQuery = CharacterEquipmentModel.find().lean();

    if (characterId) charEquipQuery.where({ characterId });
    if (itemSlot) charEquipQuery.where({ slot: itemSlot });
    if (populateItem === 'true')
      charEquipQuery.populate({
        path: 'itemId',
        select: '-createdAt -updatedAt -__v',
        localField: 'itemId',
        foreignField: 'itemId'
      });

    return await charEquipQuery.exec();
  }

  async getById(characterEquipmentId: string) {
    const characterEquipmentData =
      await CharacterEquipmentModel.findById(characterEquipmentId).lean();
    if (!characterEquipmentData) {
      throw new CustomError(
        `Character equipment with id '${characterEquipmentId}' does not exist`,
        404
      );
    }
    return characterEquipmentData;
  }

  async updateEquipmentItem(
    characterEquipmentId: string,
    itemId: number | null
  ) {
    const updateRes = CharacterEquipmentModel.findByIdAndUpdate(
      characterEquipmentId,
      {
        itemId
      },
      { new: true }
    );
    if (!updateRes) {
      throw new CustomError('Something went wrong while updating', 500);
    }
    return updateRes;
  }

  transformResponseObject(
    databaseResponse: CharacterEquipmentBackend
  ): CharacterEquipmentFrontend {
    return {
      characterId: databaseResponse.characterId.toString(),
      _id: databaseResponse._id!.toString(),
      itemId: databaseResponse.itemId,
      uiPosition: databaseResponse.uiPosition,
      slot: databaseResponse.slot
    };
  }

  transformResponseArray(
    databaseResponse: CharacterEquipmentBackend[]
  ): CharacterEquipmentFrontend[] {
    return databaseResponse.map((res) => this.transformResponseObject(res));
  }

  isCorrectSlot(
    equipmentSlot: EquipmentSlot,
    itemSlot: EquipmentSlot
  ): boolean {
    return equipmentSlot === itemSlot;
  }
}
