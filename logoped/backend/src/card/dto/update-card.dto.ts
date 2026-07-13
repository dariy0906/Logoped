import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsEnum, IsHexColor, IsNumber, IsOptional, IsString, IsUrl, Length, Max, Min } from 'class-validator';
import { VoiceEmotion, VoiceType } from '@prisma/client';

export class UpdateCardDto extends PartialType(CreateCardDto) {
       
        @IsString()
        @Length(3, 20)
        @IsOptional()
        character?: string;
        
        @IsString()
        @Length(5, 100)
        @IsOptional()
        phrase?: string;
        
        @IsString()
        @IsEnum(VoiceType)
        @IsOptional()
        voiceType?: VoiceType;
        
        @IsString()
        @IsEnum(VoiceEmotion)
        @IsOptional()
        voiceEmotion?: VoiceEmotion;
        
        @IsString()
        @IsUrl()
        @IsOptional()
        @IsOptional()
        image?: string;
        
        @IsString()
        @IsHexColor()
        @IsOptional()
        @IsOptional()
        color?: string;
        
        @IsNumber()
        @Min(1)
        @Max(10)
        @IsOptional()
        difficulty?: number;
}
