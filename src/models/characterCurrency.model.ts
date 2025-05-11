import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CharacterCurrency, CurrencyId } from '../../../shared/src';
import { CurrencyModel } from './currency.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  },
  options: { customName: 'character-currencies' }
})
export class CharacterCurrencySchema implements CharacterCurrency {
  @prop({ required: true })
  public currencyId!: CurrencyId;

  @prop({ required: true, default: 0 })
  public amount!: number;

  @prop({ required: true })
  public characterId!: Types.ObjectId;
}

export const CharacterCurrencyModel = getModelForClass(CharacterCurrencySchema);

CharacterCurrencyModel.schema.virtual('currency', {
  ref: CurrencyModel.modelName,
  localField: 'currencyId',
  foreignField: '_id',
  justOne: true
});
