import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterCurrencyBackend, CurrencyId } from '../../../shared/src';
import { CurrencySchema } from './currency.model';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'character-currencies' },
})
export class CharacterCurrencySchema implements CharacterCurrencyBackend {
  @prop({ required: true, ref: () => CurrencySchema })
  public currencyId!: CurrencyId;

  @prop({ required: true, default: 0 })
  public amount!: number;

  @prop({ required: true })
  public characterId!: Types.ObjectId;
}

export const CharacterCurrencyModel = getModelForClass(CharacterCurrencySchema);
