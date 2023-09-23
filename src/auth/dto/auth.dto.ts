import { Injectable } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';

@Injectable()
export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  pin: string;
}
