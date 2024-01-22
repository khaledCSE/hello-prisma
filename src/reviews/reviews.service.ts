import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ReviewCreateInput) {
    return this.databaseService.review.create({ data: createProductDto });
  }

  findAll() {
    return this.databaseService.review.findMany({});
  }

  async findOne(id: string) {
    return this.databaseService.review.findUnique({
      where: { id },
    });
  }

  update(id: string, updateProductDto: Prisma.ReviewUpdateInput) {
    return this.databaseService.review.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.databaseService.review.delete({ where: { id } });
  }
}
