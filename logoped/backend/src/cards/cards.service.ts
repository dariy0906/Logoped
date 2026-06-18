import { Injectable, NotFoundException } from '@nestjs/common';
import type { ExerciseCard } from '.prisma/client/default.js';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCardDto } from './dto/create-card.dto';
import type { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ExerciseCard[]> {
    return this.prisma.exerciseCard.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number): Promise<ExerciseCard> {
    const card = await this.prisma.exerciseCard.findUnique({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  create(dto: CreateCardDto): Promise<ExerciseCard> {
    return this.prisma.exerciseCard.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateCardDto): Promise<ExerciseCard> {
    await this.findOne(id);

    return this.prisma.exerciseCard.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.exerciseCard.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
