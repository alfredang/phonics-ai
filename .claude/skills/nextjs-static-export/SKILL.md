# Next.js Static Export Skill

## Overview

Configure Next.js applications for static HTML export, enabling deployment to static hosting platforms like GitHub Pages, Netlify, or any CDN without a Node.js server.

## When to Use Static Export

**Good for:**
- Documentation sites
- Marketing pages
- Blogs
- Portfolio sites
- Apps with client-side data fetching

**Not suitable for:**
- Dynamic server-side rendering
- API routes (need separate backend)
- Image optimization (must disable)
- Middleware
- Incremental Static Regeneration (ISR)

## Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: 'export',

  // Base path for subdirectory deployment (e.g., GitHub Pages repo)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },

  // Add trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
```

## Dynamic Routes with generateStaticParams

For static export, all dynamic routes must be pre-generated at build time using `generateStaticParams()`.

### Basic Example

```typescript
// app/posts/[slug]/page.tsx
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';

// REQUIRED for static export - tells Next.js which pages to generate
export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

interface PageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  return <article>{post.content}</article>;
}
```

### Multiple Dynamic Segments

```typescript
// app/[category]/[id]/page.tsx
export function generateStaticParams() {
  return [
    { category: 'electronics', id: '1' },
    { category: 'electronics', id: '2' },
    { category: 'clothing', id: '1' },
  ];
}
```

### With Data Fetching

```typescript
// app/products/[id]/page.tsx
import { getAllProducts } from '@/lib/products';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}
```

## Server vs Client Component Split

In static export, you often need to separate server logic (generateStaticParams) from client interactivity.

### Pattern: Server Page + Client Component

```typescript
// app/worlds/[worldId]/page.tsx (Server Component)
import { WORLDS } from '@/constants/worlds';
import WorldDetailClient from './WorldDetailClient';

// This runs at build time - server only
export function generateStaticParams() {
  return WORLDS.map((world) => ({
    worldId: world.id,
  }));
}

interface PageProps {
  params: { worldId: string };
}

// Server component passes params to client component
export default function WorldDetailPage({ params }: PageProps) {
  return <WorldDetailClient worldId={params.worldId} />;
}
```

```typescript
// app/worlds/[worldId]/WorldDetailClient.tsx (Client Component)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WorldDetailClientProps {
  worldId: string;
}

export default function WorldDetailClient({ worldId }: WorldDetailClientProps) {
  const router = useRouter();
  const [data, setData] = useState(null);

  // Client-side logic, hooks, event handlers
  useEffect(() => {
    // Fetch or process data
  }, [worldId]);

  return <div>{/* Interactive UI */}</div>;
}
```

### Why This Pattern?

| Concern | Server Component | Client Component |
|---------|-----------------|------------------|
| generateStaticParams | ✅ Required here | ❌ Cannot use |
| 'use client' directive | ❌ Cannot use | ✅ Required |
| useEffect, useState | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Access to params | ✅ Via props | ✅ Passed from server |

## GitHub Pages Deployment

### 1. Add .nojekyll File

GitHub Pages uses Jekyll by default, which ignores `_next` folder. Create empty `.nojekyll` file:

```
/public/.nojekyll
```

This gets copied to `/out/.nojekyll` during build.

### 2. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /repo-name

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Configure Repository

1. Go to repo Settings → Pages
2. Source: "GitHub Actions"
3. Push to main branch to trigger deployment

## Handling Links with basePath

### Using next/link

```tsx
import Link from 'next/link';

// Next.js automatically prepends basePath
<Link href="/about">About</Link>
// Renders: <a href="/repo-name/about">
```

### Manual Links (avoid when possible)

```tsx
// If you must use manual links
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

<a href={`${basePath}/about`}>About</a>
```

### Static Assets

```tsx
import Image from 'next/image';

// Next/Image handles basePath automatically
<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
```

For manual image references:
```tsx
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
<img src={`${basePath}/images/logo.png`} alt="Logo" />
```

## Common Issues and Solutions

### 1. 404 on Dynamic Routes

**Problem**: `/dashboard/worlds/letters-land` returns 404

**Solution**: Add `generateStaticParams()` to pre-generate all routes:

```typescript
export function generateStaticParams() {
  return WORLDS.map((world) => ({ worldId: world.id }));
}
```

### 2. 404 on Nested Dynamic Routes

**Problem**: `/worlds/[worldId]/lessons/[lessonId]` not working

**Solution**: Generate all combinations:

```typescript
export function generateStaticParams() {
  const params = [];
  for (const world of WORLDS) {
    for (let i = 1; i <= world.lessonCount; i++) {
      params.push({
        worldId: world.id,
        lessonId: i.toString(),
      });
    }
  }
  return params;
}
```

### 3. _next Folder 404

**Problem**: CSS/JS files not loading on GitHub Pages

**Solution**: Add `/public/.nojekyll` file (empty file)

### 4. Client Hooks in Server Component

**Problem**: `useState is not defined` or `useEffect is not defined`

**Solution**: Split into server + client components (see pattern above)

### 5. Image Optimization Error

**Problem**: Build fails with image optimization error

**Solution**: Disable in next.config.js:
```javascript
images: {
  unoptimized: true,
}
```

## Build Output Structure

After `npm run build`, the `/out` folder contains:

```
/out
├── .nojekyll
├── index.html
├── about/
│   └── index.html
├── dashboard/
│   └── worlds/
│       ├── index.html
│       └── letters-land/
│           └── index.html
├── _next/
│   ├── static/
│   │   ├── css/
│   │   └── chunks/
│   └── data/
└── images/
```

## Verification Checklist

Before deploying:

1. [ ] `output: 'export'` in next.config.js
2. [ ] `trailingSlash: true` for GitHub Pages
3. [ ] `images: { unoptimized: true }`
4. [ ] All dynamic routes have `generateStaticParams()`
5. [ ] `/public/.nojekyll` file exists
6. [ ] `NEXT_PUBLIC_BASE_PATH` set in workflow
7. [ ] No API routes or server-side features used

## Related Skills

- [GitHub Pages Documentation](../github-pages-documentation/SKILL.md)
- [Role-Based Auth](../role-based-auth/SKILL.md)
