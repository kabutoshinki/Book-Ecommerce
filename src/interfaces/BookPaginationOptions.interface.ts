interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IGetBooksOptions extends IPaginationOptions {
  search?: string;
  categories?: string[];
  authors?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRate?: number;
  maxRate?: number;
  sort?: string;
  isActive?: boolean;
  includeReviews?: boolean;
}
