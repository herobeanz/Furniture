import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as http from 'http';

interface ElasticsearchConfig {
  enabled: boolean;
  host: string;
  port: number;
  protocol: 'http' | 'https';
  index: string;
  username?: string;
  password?: string;
}

@Injectable()
export class ElasticsearchService {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly config: ElasticsearchConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      enabled: this.configService.get('ELASTICSEARCH_ENABLED', 'false') === 'true',
      host: this.configService.get('ELASTICSEARCH_HOST', 'localhost'),
      port: parseInt(this.configService.get('ELASTICSEARCH_PORT', '9200'), 10),
      protocol: (this.configService.get('ELASTICSEARCH_PROTOCOL', 'http') as 'http' | 'https'),
      index: this.configService.get('ELASTICSEARCH_INDEX', 'products'),
      username: this.configService.get('ELASTICSEARCH_USERNAME'),
      password: this.configService.get('ELASTICSEARCH_PASSWORD'),
    };

    if (this.config.enabled) {
      this.logger.log(`Elasticsearch enabled: ${this.config.protocol}://${this.config.host}:${this.config.port}/${this.config.index}`);
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Search products using Elasticsearch
   */
  async searchProducts(query: string, from: number, size: number): Promise<{ ids: number[]; total: number }> {
    if (!this.config.enabled) {
      throw new Error('Elasticsearch is not enabled');
    }

    const searchBody = {
      query: {
        multi_match: {
          query,
          fields: ['name^3', 'description^2', 'sku', 'material', 'color', 'short_description'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      },
      from,
      size,
      sort: [{ _score: { order: 'desc' } }, { created_at: { order: 'desc' } }],
    };

    const url = `${this.config.protocol}://${this.config.host}:${this.config.port}/${this.config.index}/_search`;
    
    return new Promise<{ ids: number[]; total: number }>((resolve, reject) => {
      const urlObj = new URL(url);
      const options: any = {
        hostname: urlObj.hostname,
        port: urlObj.port || (this.config.protocol === 'https' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (this.config.username && this.config.password) {
        options.headers.Authorization = `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`;
      }

      const client = this.config.protocol === 'https' ? https : http;
      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const result = JSON.parse(data);
              const hits = result.hits?.hits || [];
              const total = result.hits?.total?.value || result.hits?.total || 0;

              // Extract product IDs from Elasticsearch results
              const ids = hits
                .map((hit: any) => {
                  const id = hit._id || hit._source?.id;
                  return typeof id === 'string' ? parseInt(id, 10) : id;
                })
                .filter((id: any) => !isNaN(id) && id > 0);

              resolve({ ids, total });
            } catch (error) {
              this.logger.error('Failed to parse Elasticsearch response', error);
              reject(new Error(`Failed to parse Elasticsearch response: ${error}`));
            }
          } else {
            this.logger.error(`Elasticsearch request failed: ${res.statusCode} - ${data}`);
            reject(new Error(`Elasticsearch request failed with status ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        this.logger.error('Elasticsearch request error', error);
        reject(error);
      });

      req.write(JSON.stringify(searchBody));
      req.end();
    });
  }

  /**
   * Index a product in Elasticsearch
   */
  async indexProduct(product: any): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const doc = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku,
      material: product.material || '',
      color: product.color || '',
      price: Number(product.price),
      sale_price: product.sale_price ? Number(product.sale_price) : null,
      status: product.status,
      is_active: product.is_active,
      created_at: product.created_at?.toISOString() || new Date().toISOString(),
      category_name: product.category?.name || '',
      room_name: product.category?.room?.name || '',
    };

    const url = `${this.config.protocol}://${this.config.host}:${this.config.port}/${this.config.index}/_doc/${product.id}`;

    return new Promise<void>((resolve, reject) => {
      const urlObj = new URL(url);
      const options: any = {
        hostname: urlObj.hostname,
        port: urlObj.port || (this.config.protocol === 'https' ? 443 : 80),
        path: urlObj.pathname,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (this.config.username && this.config.password) {
        options.headers.Authorization = `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`;
      }

      const client = this.config.protocol === 'https' ? https : http;
      const req = client.request(options, (res) => {
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`Failed to index product: ${res.statusCode}`));
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(doc));
      req.end();
    });
  }
}
