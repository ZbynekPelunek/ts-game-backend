import { Request, Response } from 'express-serve-static-core';

import {
  ListCharactersRequestQuery,
  GetCharacterRequestParams,
  ListCharactersResponse,
  GetCharacterResponse,
  CreateCharacterResponse,
  CreateCharacterRequestDTO,
  UpdateCharacterRequestParams,
  UpdateCharacterRequestDTO,
  UpdateCharacterResponse,
  DeleteCharacterResponse,
  DeleteCharacterRequestParams
} from '../../../shared/src';
import { CustomError } from '../middleware/errorHandler.middleware';
import { CharacterService } from '../services/character.service';
import { sign } from 'jsonwebtoken';
import {
  AuthenticatedResponse,
  TokenValues
} from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export class CharacterController {
  private characterService: CharacterService;

  constructor() {
    this.characterService = new CharacterService();
  }

  async list(
    req: Request<{}, {}, {}, ListCharactersRequestQuery>,
    res: AuthenticatedResponse<ListCharactersResponse>
  ) {
    const tokenAccountID = res.locals.payload.accountId;
    const accountId = req.query.accountId || tokenAccountID;

    if (accountId !== tokenAccountID) {
      throw new CustomError('Account ID mismatch.', 400);
    }

    const characters = await this.characterService.list({ accountId });

    res.status(200).json({
      success: true,
      characters: characters.map((character) => {
        return {
          _id: character._id.toString(),
          characterClass: character.characterClass,
          currentExperience: character.currentExperience,
          level: character.level,
          maxExperience: character.maxExperience,
          name: character.name,
          race: character.race
        };
      })
    });
  }

  async getOneById(
    req: Request<GetCharacterRequestParams>,
    res: AuthenticatedResponse<GetCharacterResponse>
  ) {
    const { characterId } = req.params;
    const tokenCharacterIDs = res.locals.payload.characterIds;

    if (!tokenCharacterIDs.includes(characterId)) {
      throw new CustomError('Character ID mismatch.', 400);
    }

    const character = await this.characterService.getOneById(characterId);

    res.status(200).json({
      success: true,
      character: {
        _id: character._id.toString(),
        characterClass: character.characterClass,
        currentExperience: character.currentExperience,
        level: character.level,
        maxExperience: character.maxExperience,
        name: character.name,
        race: character.race
      }
    });
  }

  async patch(
    req: Request<UpdateCharacterRequestParams, {}, UpdateCharacterRequestDTO>,
    res: AuthenticatedResponse<UpdateCharacterResponse>
  ) {
    const { characterId } = req.params;
    const { experience, name } = req.body;
    const tokenCharacterIDs = res.locals.payload.characterIds;

    if (!tokenCharacterIDs.includes(characterId)) {
      throw new CustomError('Character ID mismatch.', 400);
    }

    const updatedCharacter = await this.characterService.update(characterId, {
      experience,
      name
    });

    res.status(200).json({
      success: true,
      character: {
        _id: updatedCharacter._id.toString(),
        characterClass: updatedCharacter.characterClass,
        currentExperience: updatedCharacter.currentExperience,
        level: updatedCharacter.level,
        maxExperience: updatedCharacter.maxExperience,
        name: updatedCharacter.name,
        race: updatedCharacter.race
      }
    });
  }

  async create(
    req: Request<{}, {}, CreateCharacterRequestDTO>,
    res: AuthenticatedResponse<CreateCharacterResponse>
  ) {
    const { name, race, characterClass } = req.body;
    const tokenAccountID = res.locals.payload.accountId;
    const currentCharacters = res.locals.payload.characterIds;

    const newCharacter = await this.characterService.create(tokenAccountID, {
      name,
      characterClass,
      race
    });

    const token = sign(
      {
        accountId: tokenAccountID,
        characterIds: [...currentCharacters, newCharacter.id]
      } as TokenValues,
      JWT_SECRET
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      partitioned: true
    });

    res.status(201).json({
      success: true,
      character: {
        _id: newCharacter._id.toString(),
        currentExperience: newCharacter.currentExperience,
        level: newCharacter.level,
        maxExperience: newCharacter.maxExperience,
        name: newCharacter.name,
        characterClass: newCharacter.characterClass,
        race: newCharacter.race
      }
    });
  }

  async delete(
    req: Request<DeleteCharacterRequestParams>,
    res: AuthenticatedResponse<DeleteCharacterResponse>
  ) {
    const { characterId } = req.params;
    const tokenCharacterIDs = res.locals.payload.characterIds;

    if (!tokenCharacterIDs.includes(characterId)) {
      throw new CustomError('Character ID mismatch.', 400);
    }

    await this.characterService.delete(characterId);

    res.status(200).json({ success: true });
  }
}
