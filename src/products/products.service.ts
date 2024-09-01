import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, user: User): Promise<Product> {
    const product = this.productRepository.create({ ...createProductDto, user });
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto, user: User): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, user } });

    if (!product) {
      throw new UnauthorizedException('You are not allowed to update this product');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number, user: User): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id, user } });

    if (!product) {
      throw new UnauthorizedException('You are not allowed to delete this product');
    }

    await this.productRepository.remove(product);
  }

  async approveProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    product.isApproved = true;
    return this.productRepository.save(product);
}


  async findAllApproved(): Promise<Product[]> {
    return this.productRepository.find({ where: { isApproved: true } });
  }

  async findAllByUser(user: User): Promise<Product[]> {
    return this.productRepository.find({ where: { user } });
  }
}
