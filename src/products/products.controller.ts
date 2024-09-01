import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth() // Indicates that this route uses Bearer authentication
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only authenticated users can create products.' })
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.createProduct(createProductDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the owner of the product can update it.' })
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.updateProduct(id, updateProductDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the owner of the product can delete it.' })
  deleteProduct(@Param('id') id: number, @GetUser() user: User) {
    return this.productService.deleteProduct(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('approve/:id')
  @ApiOperation({ summary: 'Approve a product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully approved.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can approve products.' })
  approveProduct(@Param('id') id: number) {
    return this.productService.approveProduct(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all approved products' })
  @ApiResponse({ status: 200, description: 'Returns a list of approved products.' })
  findAllApproved() {
    return this.productService.findAllApproved();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  @ApiOperation({ summary: 'Find all products created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns a list of products created by the user.' })
  findAllByUser(@GetUser() user: User) {
    return this.productService.findAllByUser(user);
  }
}
