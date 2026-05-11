import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { CreateCmsPageDto } from './dto/create-cms-page.dto';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('cms')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get all CMS pages' })
  @ApiResponse({ status: 200, description: 'CMS pages retrieved' })
  findAll() {
    return this.cmsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active CMS pages (public)' })
  @ApiResponse({ status: 200, description: 'Active CMS pages retrieved' })
  findActive() {
    return this.cmsService.findActive();
  }

  @Get('page/:slug')
  @ApiOperation({ summary: 'Get CMS page by slug (public)' })
  @ApiResponse({ status: 200, description: 'CMS page retrieved' })
  @ApiResponse({ status: 404, description: 'CMS page not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create CMS page' })
  @ApiResponse({ status: 201, description: 'CMS page created' })
  create(@Body() dto: CreateCmsPageDto) {
    return this.cmsService.create(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get CMS page by ID' })
  @ApiResponse({ status: 200, description: 'CMS page retrieved' })
  @ApiResponse({ status: 404, description: 'CMS page not found' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update CMS page' })
  @ApiResponse({ status: 200, description: 'CMS page updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCmsPageDto) {
    return this.cmsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete CMS page' })
  @ApiResponse({ status: 200, description: 'CMS page deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.remove(id);
  }
}
