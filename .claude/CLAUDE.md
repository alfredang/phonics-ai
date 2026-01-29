# Claude Code Skills Guide

This directory contains reusable skills and patterns learned during development of the Phonics AI project. These skills can be referenced for future projects or when implementing similar features.

## Directory Structure

```
.claude/
├── CLAUDE.md          # This file - how to use skills
├── skills/            # Reusable skill documentation
│   ├── github-pages-documentation/
│   │   └── SKILL.md   # Static docs with left nav & dark theme
│   ├── dark-blue-theme/
│   │   └── SKILL.md   # Professional dark blue color scheme
│   ├── left-side-navigation/
│   │   └── SKILL.md   # Fixed sidebar navigation pattern
│   ├── nextjs-static-export/
│   │   └── SKILL.md   # Next.js static export & GitHub Pages
│   └── role-based-auth/
│       └── SKILL.md   # RBAC with Firebase & Zustand
└── plans/             # Implementation plans (auto-generated)
```

## How to Use Skills

### 1. Reference During Development

When working on a task, check if a relevant skill exists:

```
"I need to add a sidebar navigation"
→ Read: .claude/skills/left-side-navigation/SKILL.md

"I need to deploy to GitHub Pages"
→ Read: .claude/skills/nextjs-static-export/SKILL.md

"I need to add user roles"
→ Read: .claude/skills/role-based-auth/SKILL.md
```

### 2. Skill File Format

Each SKILL.md follows this structure:

```markdown
# Skill Name

## Overview
Brief description of what this skill covers.

## Key Features
- Feature 1
- Feature 2

## Implementation
Code examples and patterns.

## Best Practices
Do's and don'ts.

## Related Skills
Links to complementary skills.
```

### 3. Adding New Skills

When you learn a new reusable pattern:

1. Create a new folder: `.claude/skills/skill-name/`
2. Add `SKILL.md` with the standard format
3. Include working code examples
4. Link to related skills

## Available Skills

| Skill | Description | Use When |
|-------|-------------|----------|
| [GitHub Pages Documentation](skills/github-pages-documentation/SKILL.md) | Static HTML docs with sidebar nav | Creating documentation sites |
| [Dark Blue Theme](skills/dark-blue-theme/SKILL.md) | Professional dark color scheme | Styling dark mode interfaces |
| [Left Side Navigation](skills/left-side-navigation/SKILL.md) | Fixed sidebar with mobile support | Building app navigation |
| [Next.js Static Export](skills/nextjs-static-export/SKILL.md) | Static site generation config | Deploying to static hosts |
| [Role-Based Auth](skills/role-based-auth/SKILL.md) | Multi-role user system | Adding user permissions |

## Quick Reference

### GitHub Pages Deployment Checklist

```javascript
// next.config.js
module.exports = {
  output: 'export',
  basePath: '/repo-name',
  trailingSlash: true,
  images: { unoptimized: true },
};
```

- [ ] Add `/public/.nojekyll`
- [ ] Add `generateStaticParams()` to dynamic routes
- [ ] Set `NEXT_PUBLIC_BASE_PATH` in GitHub Actions

### Dynamic Routes Pattern

```typescript
// Server component (page.tsx)
export function generateStaticParams() {
  return items.map((item) => ({ id: item.id }));
}

export default function Page({ params }) {
  return <ClientComponent id={params.id} />;
}

// Client component (ClientComponent.tsx)
'use client';
export default function ClientComponent({ id }) {
  // Hooks and interactivity here
}
```

### Role-Based Routing

```typescript
// In auth store
getDashboardPath: () => {
  switch (user.role) {
    case 'teacher': return '/teacher';
    case 'parent': return '/parent';
    default: return '/dashboard';
  }
}
```

### Dark Theme Colors

```css
:root {
  --bg-primary: #0a1628;
  --bg-secondary: #0f2744;
  --text-primary: #e2e8f0;
  --accent-primary: #3b82f6;
}
```

## Project-Specific Notes

### Phonics AI Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand with persist
- **Backend**: Firebase (Auth + Firestore)
- **Animation**: Framer Motion
- **Deployment**: GitHub Pages (static export)

### Key Directories

```
src/
├── app/              # Next.js pages
│   ├── (auth)/       # Login, register
│   ├── dashboard/    # Learner dashboard
│   ├── teacher/      # Teacher dashboard
│   └── parent/       # Parent dashboard
├── components/       # React components
├── stores/           # Zustand stores
├── lib/firebase/     # Firebase services
├── types/            # TypeScript types
└── constants/        # Static data (phonemes, worlds)

public/
├── docs/             # Documentation site
└── .nojekyll         # GitHub Pages config
```

## Updating This Guide

When adding significant new patterns or skills to the project:

1. Document the skill in `.claude/skills/`
2. Update this file's "Available Skills" table
3. Add any quick reference snippets if commonly used
