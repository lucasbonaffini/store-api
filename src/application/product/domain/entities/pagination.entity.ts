export interface PaginationMeta {
  hasNextPage: boolean;
  nextCursor: string | null;
  totalInPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
