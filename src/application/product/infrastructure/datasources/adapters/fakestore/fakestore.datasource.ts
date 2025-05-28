import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { FakeStoreProduct } from './fakestore.types';

@Injectable()
export class FakeStoreDataSource {
  private readonly baseUrl = 'https://fakestoreapi.com';

  constructor(private readonly httpService: HttpService) {}

  async getProducts(): Promise<FakeStoreProduct[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<FakeStoreProduct[]>(`${this.baseUrl}/products`).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(
            `Failed to fetch products from FakeStore API: ${error.message}`,
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      ),
    );
    return data;
  }

  async getProductById(id: number): Promise<FakeStoreProduct | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<FakeStoreProduct>(`${this.baseUrl}/products/${id}`)
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response?.status === 404) {
                return Promise.resolve({ data: null });
              }
              throw new HttpException(
                `Failed to fetch product from FakeStore API: ${error.message}`,
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return data;
    } catch {
      return null;
    }
  }
}
