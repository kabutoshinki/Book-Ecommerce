import {
  ElasticsearchModuleOptions,
  ElasticsearchOptionsFactory,
} from '@nestjs/elasticsearch';

export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return {
      node: 'http://localhost:9200',

      auth: {
        username: 'elastic',
        password: 'Im3lrb2iFGW+fOo2ZNiQ', // Replace with your Elasticsearch password
      },
    };
  }
}
