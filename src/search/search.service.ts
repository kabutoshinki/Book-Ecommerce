import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  private readonly logger = new Logger(SearchService.name);
  async indexData(index: string, id: string, data: any) {
    try {
      return await this.elasticsearchService.index({
        index,
        id,
        body: data,
      });
    } catch (error) {
      this.logger.error(
        `Failed to index data to Elasticsearch: ${error.message}`,
      );
      throw error; // Rethrow the error for handling in the calling function
    }
  }

  async searchData(index: string, searchQuery: string, limit = 10, page = 1) {
    const offset = (page - 1) * limit;

    try {
      const response = await this.elasticsearchService.search({
        index,
        body: {
          query: {
            multi_match: {
              query: searchQuery,
              fields: [
                'title',
                'description',
                'summary',
                'sold_quantity',
                'price',
              ],
            },
          },
          from: offset,
          size: limit,
        },
      });

      const hits = response.hits.hits.map((hit: any) => hit._source);
      const total = response.hits.total; // total can be a number or an object like SearchTotalHits

      const totalHits = typeof total === 'number' ? total : total.value; // handle total as number or object

      const totalPages = Math.ceil(totalHits / limit);
      const currentPage = parseInt(page.toString());

      return {
        total: totalHits,
        totalPages,
        currentPage,
        hits,
      };
    } catch (error) {
      this.logger.error(
        `Failed to search data in Elasticsearch: ${error.message}`,
      );
      throw error;
    }
  }
}
