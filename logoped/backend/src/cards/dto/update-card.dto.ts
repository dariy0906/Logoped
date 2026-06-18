import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  character?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  trend?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phrase?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  voiceType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  voiceEmotion?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}
