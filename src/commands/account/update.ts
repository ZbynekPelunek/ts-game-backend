import {
  UpdateAccountRequestDTO,
  UpdateAccountRequestParams,
  UpdateAccountResponseDTO
} from '../../../../shared/src';
import { AccountService } from '../../services/accountService';

export class UpdateAccountCommand {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async execute(
    params: UpdateAccountRequestParams,
    body: UpdateAccountRequestDTO
  ): Promise<UpdateAccountResponseDTO> {
    const { accountId } = params;
    //this.accountService.getById(accountId);

    const { _id, email, username, accountLevel } =
      await this.accountService.update(accountId, body);

    return {
      success: true,
      account: {
        _id: _id.toString(),
        email,
        username,
        accountLevel
      }
    };
  }
}
