export interface PrismaProductDto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePrismaProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}
