import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    const {
      character,
      phrase,
      voiceType,
      voiceEmotion,
      image,
      color,
      difficulty,
    } = createCardDto
    const existingCard = await this.prisma.exerciseCard.findUnique({
      where: { id },
    })

    if (existingCard) {
      throw new NotFoundException('User already exist')
    }

    const Createdcard = await this.prisma.exerciseCard.create({
    data: {
      character
      phrase
      voiceType
      voiceEmotion
      image
      color
      difficulty
    }
  })
    return {
      character: Createdcard.character,
      phrase: Createdcard.phrase,
      voiceType: Createdcard.voiceType,
      voiceEmotion: Createdcard.voiceEmotion,
      image: Createdcard.image,
      color: Createdcard.color,
      difficulty: Createdcard.difficulty,

    }
  }

  async update(id:number, dto: UpdateCardDto) {
    const updating = await this.prisma.exerciseCard.findUnique({where: {id}})
    if (!updating){
      throw new NotFoundException('Card not found')
    }
    const updated = await this.prisma.exerciseCard.update({where: {id} , data: {
      character: dto.character,
      phrase: dto.phrase,
      voiceType: dto.voiceType,
      voiceEmotion: dto.voiceEmotion,
      image: dto.image,
      color: dto.color,
      difficulty: dto.difficulty,
    }})

    return {character: updated.character,
      phrase: updated.phrase,
      voiceType: updated.voiceType,
      voiceEmotion: updated.voiceEmotion,
      image: updated.image,
      color: updated.color,
      difficulty: updated.difficulty,

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} card`
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`
  }

  async delete(id: number) {
    const deleting = await this.prisma.exerciseCard.findUnique({ where: {id}})
    if (!deleting){
      throw new NotFoundException('Not found card')
    }
    const deleted = await this.prisma.exerciseCard.delete({where: {id}})
    return {
      character: deleted.character,
      phrase: deleted.phrase,
      voiceType: deleted.voiceType,
      voiceEmotion: deleted.voiceEmotion,
      image: deleted.image,
      color: deleted.color,
      difficulty: deleted.difficulty,
    }
  }
}
