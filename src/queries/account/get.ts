import {
  GetAccountRequestParams,
  GetAccountResponseDTO
} from '../../../../shared/src';
import { AccountService } from '../../services/accountService';

export class GetAccountQuery {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async execute(
    params: GetAccountRequestParams
  ): Promise<GetAccountResponseDTO> {
    const { accountId } = params;

    const account = await this.accountService.getById(accountId);

    return {
      success: true,
      account: {
        _id: account._id.toString()
      }
    };
  }
}
