---
inclusion: fileMatch
fileMatchPattern: "be/**"
---

# Backend Rules - NestJS + PostgreSQL

## Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Web3 wallet
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

## Project Structure
```
be/
├── src/
│   ├── config/           # Configuration (use ConfigService; no process.env in services)
│   │   ├── index.ts
│   │   ├── env.validation.ts  # Validates flat env (DATABASE_URL, JWT_SECRET, etc.)
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── ...
│   ├── modules/           # Feature modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── ...
│   ├── common/           # Shared utilities
│   │   ├── decorators/   # @Public(), @Admin(), @Roles()
│   │   ├── guards/       # JwtAuthGuard, RolesGuard, AdminGuard
│   │   ├── interceptors/ # ResponseInterceptor -> { success, data, message }
│   │   └── filters/      # HttpExceptionFilter (requestId, userId in logs + JSON)
│   ├── database/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── dist/
```

## Key Conventions

### Config
- Use `ConfigService` from `@nestjs/config`. All config in `src/config/*.config.ts`.
- Env validation in `config/env.validation.ts` — validate **flat** env keys (e.g. `DATABASE_URL`, `JWT_SECRET`), not nested `config.database.url`.
- **Never use `process.env` in services or controllers.**

### Module Structure
Each module:
```
modules/[feature]/
├── [feature].module.ts
├── [feature].controller.ts
├── [feature].service.ts
├── dto/
│   ├── create-[feature].dto.ts
│   ├── update-[feature].dto.ts
│   └── [feature]-query.dto.ts
└── services/   # Sub-services (optional)
```

### Controller Rules
```typescript
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiTags('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, type: [Ticket] })
  async findAll(@Query() query: TicketQueryDto) {
    return this.ticketsService.findAll(query)
  }
}
```

### Service Rules
```typescript
@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name); // Always use Logger

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TicketQueryDto) {
    const { page = 1, limit = 10 } = query
    return this.prisma.ticket.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(dto: CreateTicketDto) {
    try {
      const result = await this.prisma.ticket.create({ data: dto })
      this.logger.log(`Created: ${result.id}`)
      return result
    } catch (error) {
      this.logger.error('Failed to create:', error)
      throw new BadRequestException('Failed to create')
    }
  }
}
```

### DTO Rules
```typescript
export class CreateTicketDto {
  @IsString()
  @ApiProperty()
  eventId: string

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty()
  price: number

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string
}
```

### Logging
- Use Nest `Logger` only: `private readonly logger = new Logger(ServiceName.name)`
- **No `console.log` or `console.warn`** in services, controllers, or main.

### Response Format
- `ResponseInterceptor` wraps all success responses: `{ success: true, data, message: 'Success' }`
- Errors from `HttpExceptionFilter` include `requestId` in JSON.

### Authentication
```typescript
@Public()           // No auth required
@UseGuards(JwtAuthGuard)  // Standard JWT
@Admin()            // Admin only
@Roles(UserRole.ORGANIZER) // Specific role
@ApiBearerAuth()    // Swagger auth
```

### Error Handling
- Use `NotFoundException`, `BadRequestException`, `ForbiddenException` from `@nestjs/common`
- Log errors with `this.logger.error(...)` before throwing
- Custom exceptions extend built-in NestJS exceptions

### Prisma Best Practices
- Use `select` for performance (avoid SELECT *)
- Use `include` for relations
- Add indexes for frequently queried fields
- Repositories pattern (`TicketsRepository`, `EventsRepository`) for complex/repeated queries

### API Documentation
Always use on every endpoint:
- `@ApiTags('feature')`
- `@ApiOperation({ summary: '...' })`
- `@ApiResponse({ status: 200, ... })`
- `@ApiQuery(...)` for query params

### Security
- Validate all inputs with DTOs (class-validator)
- Use `ConfigService` for secrets, never `process.env` in services
- Implement rate limiting on public endpoints
- Sanitize user-generated content

### Testing
```typescript
describe('TicketsService', () => {
  let service: TicketsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()
    service = module.get<TicketsService>(TicketsService)
  })
})
```

### Common Commands
```bash
npm run start:dev        # Start dev server
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma client
npm run build            # Build for production
```
