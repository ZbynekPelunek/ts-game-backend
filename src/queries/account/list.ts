import { ListAccountsResponseDTO } from '../../../../shared/src';
import { AccountService } from '../../services/accountService';

export class ListAccountsQuery {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async execute(): Promise<ListAccountsResponseDTO> {
    const accounts = await this.accountService.list();

    return {
      success: true,
      accounts: accounts.map((acc) => {
        return {
          _id: acc._id.toString()
        };
      })
    };
  }
}
