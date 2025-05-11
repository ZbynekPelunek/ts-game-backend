import { CustomError } from '../middleware/errorHandler.middleware';
import { AttributeModel } from '../models/attribute.model';

export class AttributeService {
  async list() {
    const dbQuery = AttributeModel.find().lean();

    return await dbQuery.exec();
  }

  async getOneById(data: { attributeId: string }) {
    const { attributeId } = data;

    const dbQuery = AttributeModel.findById(attributeId).lean();

    const attribute = await dbQuery.exec();

    if (!attribute) {
      throw new CustomError(`Attribute with id ${attributeId} not found.`, 404);
    }
    return attribute;
  }
}
