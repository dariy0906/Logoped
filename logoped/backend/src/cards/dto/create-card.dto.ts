import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  character!: string;

  @IsString()
  @IsNotEmpty()
  trend!: string;

  @IsString()
  @IsNotEmpty()
  phrase!: string;

  @IsString()
  @IsNotEmpty()
  voiceType!: string;

  @IsString()
  @IsNotEmpty()
  voiceEmotion!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  difficulty!: number;
}
