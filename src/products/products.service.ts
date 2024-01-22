import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ProductCreateInput) {
    return this.databaseService.product.create({ data: createProductDto });
  }

  findAll() {
    return this.databaseService.product.findMany({});
  }

  async findOne(id: string) {
    return this.databaseService.product.findUnique({
      where: { id },
      include: { reviews: true, tags: true, _count: true },
    });
  }

  update(id: string, updateProductDto: Prisma.ProductUpdateInput) {
    return this.databaseService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.databaseService.product.delete({ where: { id } });
  }
}
