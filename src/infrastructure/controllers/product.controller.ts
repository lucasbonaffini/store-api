import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheKey, CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  UpdateStockDto,
  ProductResponseDto,
} from 'src/application/dtos/product.dto';

@ApiTags('products')
@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @CacheKey('all_products')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get all products with stock' })
  @ApiResponse({
    status: 200,
    description: 'Returns all products with stock info',
    type: [ProductResponseDto],
  })
  async findAll() {
    const products = await this.productService.findAll();
    return products.map((product) => product.toJSON());
  }

  @Get(':id')
  @CacheKey('product_by_id')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a product by ID',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.findById(id);
      return product.toJSON();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
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
    const product = await this.productService.create(createProductDto);
    return product.toJSON();
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    const product = await this.productService.updateStock(id, updateStockDto);
    return product.toJSON();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
  }
}
