import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
