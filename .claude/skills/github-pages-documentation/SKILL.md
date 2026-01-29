# GitHub Pages Documentation Skill

## Overview

Create professional, static documentation sites hosted on GitHub Pages with left-side navigation, dark theme, and responsive design - all without any build tools or frameworks.

## Key Features

- Pure HTML/CSS (no JavaScript frameworks required)
- Dark blue professional theme
- Fixed left sidebar navigation with collapsible sections
- Mobile-responsive with hamburger menu
- Syntax highlighting for code blocks
- Smooth scroll and active section highlighting

## File Structure

```
/public/docs/
├── index.html          # Main landing page
├── styles.css          # Shared styles (dark blue theme)
├── getting-started.html
├── features/
│   ├── feature-1.html
│   └── feature-2.html
└── api/
    └── reference.html
```

## Implementation

### 1. Base HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation - Project Name</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Mobile Header -->
  <header class="mobile-header">
    <button class="menu-toggle" onclick="toggleSidebar()">
      <span></span><span></span><span></span>
    </button>
    <span class="logo">Project Name</span>
  </header>

  <!-- Sidebar Navigation -->
  <nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <a href="index.html" class="logo">
        <span class="logo-icon">📚</span>
        <span>Project Name</span>
      </a>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Getting Started</div>
      <ul class="nav-list">
        <li><a href="index.html" class="active">Introduction</a></li>
        <li><a href="installation.html">Installation</a></li>
        <li><a href="quick-start.html">Quick Start</a></li>
      </ul>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Features</div>
      <ul class="nav-list">
        <li><a href="features/feature-1.html">Feature 1</a></li>
        <li><a href="features/feature-2.html">Feature 2</a></li>
      </ul>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="content">
    <div class="content-wrapper">
      <h1>Documentation Title</h1>
      <p class="lead">Brief description of what this page covers.</p>

      <!-- Content sections -->
      <section id="section-1">
        <h2>Section Title</h2>
        <p>Content goes here...</p>

        <pre><code>// Code example
const example = "code";</code></pre>
      </section>

      <!-- Page Navigation -->
      <div class="page-nav">
        <a href="previous.html" class="prev">← Previous: Page Name</a>
        <a href="next.html" class="next">Next: Page Name →</a>
      </div>
    </div>
  </main>

  <script>
    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('open');
    }
  </script>
</body>
</html>
```

### 2. CSS Variables for Theming

```css
:root {
  /* Dark Blue Theme Colors */
  --bg-primary: #0a1628;
  --bg-secondary: #0f2744;
  --bg-tertiary: #1a3a5c;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #3b82f6;
  --accent-secondary: #60a5fa;
  --border-color: #1e3a5f;

  /* Layout */
  --sidebar-width: 280px;
  --header-height: 60px;
  --content-max-width: 900px;
}
```

### 3. Sidebar Styles

```css
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.nav-section {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.nav-section-title {
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list a {
  display: block;
  padding: 0.5rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-list a:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-list a.active {
  color: var(--accent-secondary);
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid var(--accent-primary);
}
```

### 4. Mobile Responsiveness

```css
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .mobile-header {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    align-items: center;
    padding: 0 1rem;
    z-index: 99;
  }

  .content {
    margin-left: 0;
    padding-top: calc(var(--header-height) + 2rem);
  }
}
```

## GitHub Pages Setup

### For Next.js Projects

1. Place docs in `/public/docs/` folder
2. Files are copied to `/out/docs/` during build
3. Add `.nojekyll` file to `/public/` to serve `_next` folder

### For Standalone Docs

1. Create `/docs/` folder at repository root
2. Enable GitHub Pages in repo settings
3. Set source to "Deploy from a branch" → `main` → `/docs`

## Best Practices

1. **Consistent Navigation**: Keep sidebar navigation identical across all pages
2. **Breadcrumbs**: Add breadcrumb navigation for deep hierarchies
3. **Active States**: Highlight current page in navigation
4. **Code Blocks**: Use syntax highlighting with proper language tags
5. **Responsive**: Test on mobile - sidebar should collapse to hamburger menu
6. **Anchors**: Use IDs for sections to enable direct linking
7. **Previous/Next**: Add page navigation at bottom for flow

## Related Skills

- [Dark Blue Theme](../dark-blue-theme/SKILL.md)
- [Left Side Navigation](../left-side-navigation/SKILL.md)
- [Next.js Static Export](../nextjs-static-export/SKILL.md)
