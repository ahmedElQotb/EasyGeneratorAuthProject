import { IsString, MinLength } from 'class-validator';
import { BaseAuthDto } from './base-auth.dto';

export class SignUpInfo extends BaseAuthDto {
  /** User full name */
  @IsString()
  @MinLength(3)
  name: string;

  // Inherits email and password from BaseAuthDto
}
