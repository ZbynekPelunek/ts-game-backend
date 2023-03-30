import mongoose, { Schema } from 'mongoose';

import { Attribute } from '../../../shared/src';

const attributeSchema = new Schema<Attribute>({
  attributeId: {
    type: String
  },
  label: String,
  desc: {
    type: String,
    default: ''
  },
  type: {
    type: String
  },
  percent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const AttributeModel = mongoose.model('Attribute', attributeSchema);