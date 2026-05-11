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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active rooms' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved' })
  getRooms() {
    return this.roomsService.findAll();
  }

  @Get('list/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get all rooms' })
  @ApiResponse({ status: 200, description: 'All rooms retrieved' })
  getAdminList() {
    return this.roomsService.findAllAdmin();
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room retrieved' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findById(id);
  }

  @Get(':slug/categories')
  @ApiOperation({ summary: 'Get categories by room slug' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  getRoomCategories(@Param('slug') slug: string) {
    return this.roomsService.findCategoriesByRoomSlug(slug);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get room by slug' })
  @ApiResponse({ status: 200, description: 'Room retrieved' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  getRoom(@Param('slug') slug: string) {
    return this.roomsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create room' })
  @ApiResponse({ status: 201, description: 'Room created' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update room' })
  @ApiResponse({ status: 200, description: 'Room updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete room' })
  @ApiResponse({ status: 200, description: 'Room deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
