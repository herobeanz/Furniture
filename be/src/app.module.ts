import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from './shared/modules/redis.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { ReportsModule } from './reports/reports.module';
import { BlogModule } from './blog/blog.module';
import { UploadsModule } from './uploads/uploads.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    SharedModule,
    RedisModule,
    HealthModule,
    CategoriesModule,
    ProductsModule,
    InquiriesModule,
    AuthModule,
    CollectionsModule,
    ReportsModule,
    BlogModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
