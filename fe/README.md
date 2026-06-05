# Frontend - Furniture Store

Vue 3 + TypeScript + Vite frontend application.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Static public files
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── package.json
```

## Setup

```bash
# Install dependencies
yarn install

# Copy environment variables (brand, liên hệ, MXH)
cp .env.example .env
# Dev URLs: fe/.env.development (đã có sẵn, tự load khi yarn dev)
```

## Development

```bash
# Start development server
yarn dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
# Build for production
yarn build
```

## Preview Production Build

```bash
# Preview production build locally
yarn preview
```

## Environment Variables

| File | Mục đích |
|------|----------|
| `.env` | Brand, liên hệ, MXH (chung dev + prod) |
| `.env.development` | API/App URL local — tự load khi `yarn dev` |
| `.env.production.example` | Mẫu biến cho Vercel production |

```bash
cp .env.example .env
```

Dev (`yarn dev`): `VITE_API_BASE_URL=http://localhost:3000/api/v1` từ `.env.development`.

Production (Vercel): set `VITE_API_BASE_URL`, `VITE_APP_URL`, Supabase keys theo `.env.production.example`.

## Features

- ✅ Vue 3 Composition API
- ✅ TypeScript support
- ✅ Vue Router for routing
- ✅ Pinia for state management
- ✅ Axios for API calls
- ✅ LocalStorage persistence where needed
- ✅ Responsive design ready

## Next Steps

- Setup UI components library (Shadcn UI for Vue)
- Implement product listing
- Implement product detail page
- (Tùy dự án) Bổ sung các tính năng thương mại khác nếu cần
- Add search and filters
- Setup SEO meta tags
