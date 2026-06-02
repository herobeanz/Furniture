import { Header } from '@nestjs/common';

/** Cache ngắn cho GET public — CDN/trình duyệt có thể tái sử dụng. */
export const PublicCacheHeaders = () =>
  Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
