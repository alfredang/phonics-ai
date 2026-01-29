# Dark Blue Theme Skill

## Overview

Create a professional dark blue color scheme for documentation sites, dashboards, and web applications. This theme provides excellent readability while maintaining a modern, sophisticated appearance.

## Color Palette

### Primary Colors

```css
:root {
  /* Backgrounds - Darkest to Lightest */
  --bg-primary: #0a1628;      /* Main background */
  --bg-secondary: #0f2744;    /* Sidebar, cards */
  --bg-tertiary: #1a3a5c;     /* Hover states, elevated elements */
  --bg-code: #0d1f35;         /* Code blocks */

  /* Text Colors */
  --text-primary: #e2e8f0;    /* Main text - high contrast */
  --text-secondary: #94a3b8;  /* Secondary text */
  --text-muted: #64748b;      /* Muted text, labels */

  /* Accent Colors */
  --accent-primary: #3b82f6;  /* Primary actions, links */
  --accent-secondary: #60a5fa; /* Hover states, highlights */
  --accent-tertiary: #93c5fd; /* Light accent for special elements */

  /* Semantic Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #06b6d4;

  /* Border Colors */
  --border-color: #1e3a5f;
  --border-light: #2d4a6f;
}
```

### Color Ratios

| Element | Background | Text | Contrast Ratio |
|---------|------------|------|----------------|
| Body | #0a1628 | #e2e8f0 | 12.5:1 |
| Sidebar | #0f2744 | #94a3b8 | 7.2:1 |
| Card | #1a3a5c | #e2e8f0 | 8.9:1 |
| Code | #0d1f35 | #60a5fa | 6.8:1 |

All ratios meet WCAG AA standards (minimum 4.5:1 for normal text).

## Implementation

### Base Styles

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}
```

### Typography

```css
h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 1rem;
}

h1 { font-size: 2.25rem; }
h2 { font-size: 1.75rem; color: var(--accent-secondary); }
h3 { font-size: 1.375rem; }

p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--accent-secondary);
}
```

### Cards and Containers

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.card:hover {
  border-color: var(--border-light);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-title {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  color: var(--text-muted);
  font-size: 0.875rem;
}
```

### Code Blocks

```css
pre {
  background: var(--bg-code);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

code {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  color: var(--accent-secondary);
}

/* Inline code */
p code, li code {
  background: var(--bg-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.85em;
}
```

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-secondary);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--border-light);
}
```

### Form Elements

```css
input, textarea, select {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.625rem 0.875rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  width: 100%;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

input::placeholder {
  color: var(--text-muted);
}

label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
```

### Tables

```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--border-color);
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

tr:hover td {
  background: rgba(59, 130, 246, 0.05);
}
```

### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.badge-error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.badge-info {
  background: rgba(6, 182, 212, 0.15);
  color: #22d3ee;
}
```

## Scrollbar Styling

```css
/* Webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-light);
}
```

## Gradients and Effects

```css
/* Subtle gradient background */
.gradient-bg {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

/* Glow effect for important elements */
.glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Frosted glass effect */
.glass {
  background: rgba(15, 39, 68, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(30, 58, 95, 0.5);
}
```

## Best Practices

1. **Contrast First**: Always verify text has sufficient contrast against backgrounds
2. **Accent Sparingly**: Use accent colors for interactive elements and highlights, not for large areas
3. **Hierarchy**: Use background shades to create visual hierarchy (darker = lower, lighter = elevated)
4. **Borders**: Subtle borders help define element boundaries in low-contrast themes
5. **Focus States**: Always include visible focus states for accessibility
6. **Test in Dark**: View your design in actual dark conditions to verify readability

## Related Skills

- [GitHub Pages Documentation](../github-pages-documentation/SKILL.md)
- [Left Side Navigation](../left-side-navigation/SKILL.md)
