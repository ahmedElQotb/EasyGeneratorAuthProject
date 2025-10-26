import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class BaseAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
    message: 'Password must contain at least one number, one letter (upper or lower), and one special character'
  })
  password: string;
}
