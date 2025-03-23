import {
  CreateAccountRequestDTO,
  CreateAccountResponseDTO
} from '../../../../shared/src';
import { AccountService } from '../../services/accountService';

export class CreateAccountCommand {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async execute(
    body: CreateAccountRequestDTO
  ): Promise<CreateAccountResponseDTO> {
    const { id, email, username } = await this.accountService.create(body);

    return {
      success: true,
      account: {
        _id: id,
        email: email,
        username: username
      }
    };
  }
}
