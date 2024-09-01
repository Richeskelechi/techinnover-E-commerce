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
  ) { }

  async createProduct(createProductDto: CreateProductDto, user: User): Promise<Product> {
    const product = this.productRepository.create({ ...createProductDto, user });
    const savedProduct = await this.productRepository.save(product);
    delete savedProduct.user
    return savedProduct
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto, user: User): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.user.id !== user.id) {
      throw new UnauthorizedException('You are not allowed to delete this product');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number, user: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.user.id !== user.id) {
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


  async findAllApproved(page: number, limit: number) {
    const [result, total] = await this.productRepository.findAndCount({
      where: { isApproved: true },
      take: limit,
      skip: (page - 1) * limit,
      select: ['id', 'name', 'description', 'price', 'quantity', 'isApproved', 'createdAt'],
      order: {
        createdAt: 'DESC',
      },
    });
    return { data: result, count: total, page, limit };
  }

  async findAllByUser(user: User, page: number, limit: number) {
    const [result, total] = await this.productRepository.findAndCount({
      where: { user },
      take: limit,
      skip: (page - 1) * limit,
      select: ['id', 'name', 'description', 'price', 'quantity', 'isApproved', 'createdAt'],
      order: {
        createdAt: 'DESC',
      },
    });
    return { data: result, count: total, page, limit };
  }

}
