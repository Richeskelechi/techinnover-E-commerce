import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth() // Indicates that this route uses Bearer authentication
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only authenticated users can create products.' })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    const newProduct = await this.productService.createProduct(createProductDto, user);
    return { statusCode: HttpStatus.CREATED, msg: "Product created successfully", data: newProduct }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the owner of the product can update it.' })
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    const updatedProduct = await this.productService.updateProduct(id, updateProductDto, user);
    return { statusCode: HttpStatus.OK, msg: "Product updated successfully", data: updatedProduct }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the owner of the product can delete it.' })
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: number, @GetUser() user: User) {
    const deletedProduct = await this.productService.deleteProduct(id, user);
    return { statusCode: HttpStatus.OK, msg: "Product deleted successfully", data: deletedProduct }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('approve/:id')
  @ApiOperation({ summary: 'Approve a product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully approved.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can approve products.' })
  @HttpCode(HttpStatus.OK)
  async approveProduct(@Param('id') id: number) {
    const approvedProduct = await this.productService.approveProduct(id);
    return { statusCode: HttpStatus.OK, msg: "Product deleted successfully", data: approvedProduct }
  }

  @Get()
  @ApiOperation({ summary: 'Find all approved products' })
  @ApiResponse({ status: 200, description: 'Returns a list of approved products.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit of items per page', example: 10 })
  @HttpCode(HttpStatus.OK)
  async findAllApproved(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const allProducts = await this.productService.findAllApproved(page, limit);
    return { statusCode: HttpStatus.OK, msg: "Products retrieved successfully", data: allProducts }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  @ApiOperation({ summary: 'Find all products created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns a list of products created by the user.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit of items per page', example: 10 })
  @HttpCode(HttpStatus.OK)
  async findAllByUser(
    @GetUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const allProducts = await this.productService.findAllByUser(user, page, limit);
    return { statusCode: HttpStatus.OK, msg: "Products retrieved successfully", data: allProducts }
  }
}
