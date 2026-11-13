import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductDto, ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * GET /products
   * Returns all available products (components), their brands (parts),
   * and each brand's measurement options (LOOSE, CAN, PIECE).
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(): Promise<ProductDto[]> {
    return this.productService.getAllProducts();
  }
}
