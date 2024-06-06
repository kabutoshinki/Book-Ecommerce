import { BookListType, SortCriteria } from '../enums/book.enum';

export interface GetBooksOptions {
  type: BookListType;
  limit?: number;
  categoryName?: string;
  sortBy?: SortCriteria[];
}
