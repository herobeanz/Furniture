import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroItemDto } from './dto/create-hero-item.dto';
import { UpdateHeroItemDto } from './dto/update-hero-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  /** Public: list active hero items (rooms) for homepage */
  @Get()
  findAllActive() {
    return this.heroService.findAllActive();
  }

  @Get('list/all')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.heroService.findAll();
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.heroService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateHeroItemDto) {
    return this.heroService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHeroItemDto) {
    return this.heroService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.heroService.remove(id);
  }
}
