import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CacheKey, CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { IProductService } from './interfaces/product.service.interface';
import {
  CreateProductDto,
  UpdateStockDto,
  ProductResponseDto,
} from 'src/application/product/delivery/dtos/product.dto';

@ApiTags('products')
@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  constructor(
    @Inject('IProductService') private readonly productService: IProductService,
  ) {}

  @Get()
  @CacheKey('all_products')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Get all products with stock' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all products with stock info',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.getProducts({ page, limit });
  }

  @Get(':id')
  @CacheKey('product_by_id')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a product by ID',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.productService.getProductById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Put(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({
    status: 200,
    description: 'Product stock updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateStock(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return await this.productService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.productService.deleteProduct(id);
  }
}
