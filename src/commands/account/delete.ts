import {
  DeleteAccountRequestParams,
  DeleteAccountResponseDTO
} from '../../../../shared/src';
import { AccountService } from '../../services/accountService';

export class DeleteAccountCommand {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async execute(
    params: DeleteAccountRequestParams
  ): Promise<DeleteAccountResponseDTO> {
    const { accountId } = params;

    await this.accountService.getById(accountId);
    await this.accountService.delete(accountId);

    return {
      success: true
    };
  }
}
