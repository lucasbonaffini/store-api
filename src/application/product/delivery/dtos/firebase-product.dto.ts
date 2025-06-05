export interface FirebaseProductDto {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFirebaseProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

export interface PaginationMeta {
  hasNextPage: boolean;
  nextCursor: string | null;
  currentPage: string;
  totalInPage: number;
}

export interface PaginatedFirebaseResponse {
  data: FirebaseProductDto[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string | null;
  };
}

export interface PaginatedApiResponse<T> {
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
  error: {
    message: string | null;
  };
}

export interface PaginationQuery {
  limit?: number;
  cursor?: string;
  category?: string;
}
