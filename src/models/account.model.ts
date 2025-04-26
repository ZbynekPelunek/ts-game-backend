import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Account } from '../interfaces/account';

export const EMAIL_MIN_LENGTH = 5;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 50;

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { customName: 'accounts' }
})
export class AccountSchema implements Account {
  @prop({
    required: [true, 'Username is required!'],
    trim: true,
    minlength: [
      USERNAME_MIN_LENGTH,
      `Username must have at least ${USERNAME_MIN_LENGTH} characters!`
    ],
    maxlength: [
      USERNAME_MAX_LENGTH,
      `Username cannot have more than ${USERNAME_MAX_LENGTH} characters!`
    ]
  })
  public username!: string;

  @prop({
    required: [true, 'Email is required!'],
    unique: [true, 'Email must be unique!'],
    trim: true,
    minlength: [
      EMAIL_MIN_LENGTH,
      `Email must have at least ${EMAIL_MIN_LENGTH} characters!`
    ]
  })
  public email!: string;

  @prop({
    required: [true, 'Password is required!'],
    trim: true,
    select: false,
    minlength: [
      PASSWORD_MIN_LENGTH,
      `Password must have at least ${PASSWORD_MIN_LENGTH} characters!`
    ]
  })
  public password!: string;

  @prop({
    default: 0,
    min: [0, 'Account level cannot be less than 0!'],
    max: [5, 'Account level cannot be more than 5!']
  })
  public accountLevel!: number;
}

export const AccountModel = getModelForClass(AccountSchema);
