export interface FirebaseProductEntity {
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

export interface CreateFirebaseProductEntity {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

export interface FirebasePaginationMeta {
  hasNextPage: boolean;
  nextCursor: string | null;
  totalInPage: number;
}

export interface PaginatedFirebaseResponse {
  data: FirebaseProductEntity[];
  pagination: FirebasePaginationMeta;
}
