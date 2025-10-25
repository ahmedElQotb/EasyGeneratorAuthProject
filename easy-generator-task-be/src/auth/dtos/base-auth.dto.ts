import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class BaseAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
    message: 'Password must contain at least one number, one uppercase letter, and one special character'
  })
  password: string;
}
