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

# Copy environment variables
cp .env.example .env
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

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Furniture Store
VITE_APP_URL=http://localhost:5173
```

## Features

- ✅ Vue 3 Composition API
- ✅ TypeScript support
- ✅ Vue Router for routing
- ✅ Pinia for state management
- ✅ Axios for API calls
- ✅ LocalStorage persistence for cart and wishlist
- ✅ Responsive design ready

## Next Steps

- Setup UI components library (Shadcn UI for Vue)
- Implement product listing
- Implement product detail page
- Implement cart and wishlist functionality
- Add search and filters
- Setup SEO meta tags
