import { IsString } from 'class-validator';

export class RefreshInput {
  @IsString()
  refreshToken: string;
} 