import { IsEnum, IsHexColor, IsNumber, IsOptional, IsString, IsUrl, Length, Max, Min } from "class-validator";
import { VoiceEmotion, VoiceType } from "@prisma/client"

export class CreateCardDto {
    
    @IsString()
    @Length(3, 20)
    character: string;
    
    @IsString()
    @Length(5, 100)
    phrase: string;
    
    @IsString()
    @IsEnum(VoiceType)
    voiceType: VoiceType;
    
    @IsString()
    @IsEnum(VoiceEmotion)
    voiceEmotion: VoiceEmotion;
    
    @IsString()
    @IsUrl()
    @IsOptional()
    image: string;
    
    @IsString()
    @IsHexColor()
    @IsOptional()
    color: string;
    
    @IsNumber()
    @Min(1)
    @Max(10)
    difficulty: number;
}

