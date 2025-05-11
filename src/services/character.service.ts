import { capitalize } from 'lodash';
import {
  CharacterEquipmentFrontend,
  CreateCharacterRequestDTO,
  EquipmentSlot,
  ListCharactersRequestQuery,
  UiPosition,
  UpdateCharacterRequestDTO
} from '../../../shared/src';
import { generateDefaultCharacterAttributes } from '../defaultCharacterData/attributes';
import { generateCharacterCurrencies } from '../defaultCharacterData/currencies';
import { generateCharacterInventory } from '../defaultCharacterData/inventory';
import { CustomError } from '../middleware/errorHandler.middleware';
import { AttributeModel } from '../models/attribute.model';
import { CharacterModel } from '../models/character.model';
import { CharacterCurrencyModel } from '../models/characterCurrency.model';
import { CharacterEquipmentModel } from '../models/characterEquipment.model';
import { InventoryModel } from '../models/inventory.model';
import { CharacterAttributeModel } from '../models/characterAttribute.model';
import {
  AccountModel,
  MAX_CHARACTERS_PER_ACCOUNT
} from '../models/account.model';

export class CharacterService {
  async list(queryParams: ListCharactersRequestQuery) {
    const { accountId } = queryParams;
    const query = CharacterModel.find().lean();

    if (accountId) query.where({ accountId });

    return await query.exec();
  }

  async getOneById(characterId: string) {
    const character = await CharacterModel.findById(characterId).lean();
    if (!character) {
      throw new CustomError(
        `Character with id '${characterId}' not found`,
        404
      );
    }
    return character;
  }

  async create(accountId: string, body: CreateCharacterRequestDTO) {
    const account = await AccountModel.findById(accountId).lean();

    if (!account) {
      throw new CustomError(`Account with id ${accountId} not found.`, 400);
    }

    const accountCharacters = await CharacterModel.find({ accountId });

    if (accountCharacters.length >= MAX_CHARACTERS_PER_ACCOUNT) {
      throw new CustomError('Max characters limit reached.', 400);
    }

    const { name, race, characterClass } = body;

    const characterName = capitalize(name.trim());

    const isNameUnique = await CharacterModel.findOne({
      name: characterName
    }).lean();

    if (isNameUnique) {
      throw new CustomError('Character with that name already exists.', 400);
    }

    const character = new CharacterModel({
      accountId,
      name: characterName,
      race,
      characterClass,
      maxInventorySlot: 20
    });
    await Promise.all([
      this.createCharacterAttributes(character.id),
      this.createCharacterCurrencies(character.id),
      this.createCharacterEquipment(character.id),
      this.createCharacterInventory(character.id)
    ]);

    return await character.save();
  }

  async update(characterId: string, body: UpdateCharacterRequestDTO) {
    const { name, experience } = body;

    const character = await CharacterModel.findById(characterId);

    if (!character) {
      throw new CustomError(
        `Character with id '${characterId}' not found`,
        400
      );
    }

    const updateFields: Record<string, any> = {};

    if (name) {
      const characterName = capitalize(name?.trim());
      console.log('characterName: ', characterName);

      const nameExists = await CharacterModel.findOne({
        name: characterName
      }).lean();

      if (nameExists) {
        throw new CustomError('Character with that name already exists.', 400);
      }

      updateFields.name = characterName;
    }

    if (experience > 0) {
      const { currentExperience, maxExperience, level } = character;
      const experienceLevel = this.levelUp({
        currentExperience,
        maxExperience,
        level,
        experienceToInrease: experience
      });

      updateFields.currentExperience = experienceLevel.currentExperience;
      updateFields.maxExperience = experienceLevel.maxExperience;
      updateFields.level = experienceLevel.level;
    }

    if (Object.keys(updateFields).length === 0) {
      return character;
    }

    const updatedCharacter = await CharacterModel.findByIdAndUpdate(
      characterId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCharacter) {
      throw new CustomError('No character updated.', 400);
    }

    return updatedCharacter;
  }

  async delete(characterId: string) {
    const deleted = await CharacterModel.findByIdAndDelete(characterId);
    if (!deleted) {
      throw new CustomError(
        `Character with id '${characterId}' not found`,
        404
      );
    }
  }

  private async createCharacterAttributes(characterId: string): Promise<void> {
    const allAttributesResponse = await AttributeModel.find().lean();

    const defaultCharacterAttributes = generateDefaultCharacterAttributes(
      allAttributesResponse,
      characterId
    );

    await CharacterAttributeModel.create(defaultCharacterAttributes);
  }

  private async createCharacterCurrencies(characterId: string): Promise<void> {
    const defaultCharacterCurrencies = generateCharacterCurrencies(characterId);

    await CharacterCurrencyModel.create(defaultCharacterCurrencies);
  }

  private async createCharacterEquipment(characterId: string): Promise<void> {
    const equipmentArr: Pick<
      CharacterEquipmentFrontend,
      'characterId' | 'itemId' | 'slot' | 'uiPosition'
    >[] = [];
    for (const e in EquipmentSlot) {
      const equipmentObj: Pick<
        CharacterEquipmentFrontend,
        'characterId' | 'itemId' | 'slot' | 'uiPosition'
      > = {
        slot: e as EquipmentSlot,
        characterId: characterId,
        uiPosition: UiPosition.LEFT,
        itemId: null
      };
      equipmentArr.push(equipmentObj);
    }

    await CharacterEquipmentModel.create(equipmentArr);
  }

  private async createCharacterInventory(characterId: string): Promise<void> {
    const defaultCharacterInventory = generateCharacterInventory(characterId);
    await InventoryModel.create(defaultCharacterInventory);
  }

  private levelUp = (data: {
    currentExperience: number;
    maxExperience: number;
    level: number;
    experienceToInrease: number;
  }) => {
    if (
      data.currentExperience + data.experienceToInrease <
      data.maxExperience
    ) {
      data.currentExperience += data.experienceToInrease;
    } else {
      data.level++;
      data.experienceToInrease -= data.maxExperience;
      this.levelUp(data);
    }

    return {
      currentExperience: data.currentExperience,
      maxExperience: data.maxExperience,
      level: data.level
    };
  };
}
