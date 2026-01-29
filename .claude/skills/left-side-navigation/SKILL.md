# Left Side Navigation Skill

## Overview

Implement a fixed left sidebar navigation pattern commonly used in documentation sites, admin dashboards, and web applications. Features collapsible sections, active state highlighting, and responsive mobile adaptation.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────────┐ │
│ │  LOGO    │ │                                            │ │
│ ├──────────┤ │                                            │ │
│ │ Section  │ │                                            │ │
│ │ ├─ Link  │ │              MAIN CONTENT                  │ │
│ │ ├─ Link  │ │                                            │ │
│ │ └─ Link  │ │                                            │ │
│ ├──────────┤ │                                            │ │
│ │ Section  │ │                                            │ │
│ │ ├─ Link  │ │                                            │ │
│ │ └─ Link  │ │                                            │ │
│ └──────────┘ └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## HTML Structure

```html
<body>
  <!-- Mobile Header (hidden on desktop) -->
  <header class="mobile-header">
    <button class="menu-toggle" aria-label="Toggle menu" onclick="toggleSidebar()">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    <span class="mobile-logo">Site Name</span>
  </header>

  <!-- Sidebar -->
  <nav class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
    <!-- Logo/Brand -->
    <div class="sidebar-header">
      <a href="/" class="logo">
        <span class="logo-icon">🏠</span>
        <span class="logo-text">Site Name</span>
      </a>
    </div>

    <!-- Navigation Sections -->
    <div class="sidebar-content">
      <div class="nav-section">
        <button class="nav-section-header" aria-expanded="true">
          <span class="section-title">Getting Started</span>
          <span class="chevron">▼</span>
        </button>
        <ul class="nav-list">
          <li><a href="/intro" class="nav-link active">Introduction</a></li>
          <li><a href="/install" class="nav-link">Installation</a></li>
          <li><a href="/quick-start" class="nav-link">Quick Start</a></li>
        </ul>
      </div>

      <div class="nav-section">
        <button class="nav-section-header" aria-expanded="true">
          <span class="section-title">Core Concepts</span>
          <span class="chevron">▼</span>
        </button>
        <ul class="nav-list">
          <li><a href="/concepts/basics" class="nav-link">Basics</a></li>
          <li>
            <a href="/concepts/advanced" class="nav-link has-children">
              Advanced
            </a>
            <ul class="nav-sublist">
              <li><a href="/concepts/advanced/topic-1" class="nav-link">Topic 1</a></li>
              <li><a href="/concepts/advanced/topic-2" class="nav-link">Topic 2</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <!-- Sidebar Footer (optional) -->
    <div class="sidebar-footer">
      <a href="/settings" class="footer-link">Settings</a>
      <span class="version">v1.0.0</span>
    </div>
  </nav>

  <!-- Overlay for mobile -->
  <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>

  <!-- Main Content -->
  <main class="content">
    <div class="content-wrapper">
      <!-- Page content here -->
    </div>
  </main>
</body>
```

## CSS Implementation

### Layout Variables

```css
:root {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 64px;
  --header-height: 60px;
  --transition-speed: 0.3s;
}
```

### Sidebar Base

```css
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.sidebar-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Logo Styling

```css
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.125rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo:hover {
  color: var(--accent-primary);
}
```

### Navigation Sections

```css
.nav-section {
  margin-bottom: 0.5rem;
}

.nav-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-section-header:hover {
  color: var(--text-secondary);
}

.chevron {
  font-size: 0.625rem;
  transition: transform var(--transition-speed);
}

.nav-section-header[aria-expanded="false"] .chevron {
  transform: rotate(-90deg);
}

.nav-section-header[aria-expanded="false"] + .nav-list {
  display: none;
}
```

### Navigation Links

```css
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.15s;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-link.active {
  color: var(--accent-secondary);
  background: rgba(59, 130, 246, 0.1);
  border-left-color: var(--accent-primary);
}
```

### Nested Navigation

```css
.nav-sublist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: none;
}

.nav-link.has-children.expanded + .nav-sublist {
  display: block;
}

.nav-sublist .nav-link {
  padding-left: 3rem;
  font-size: 0.8125rem;
}

.nav-sublist .nav-link::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
  margin-right: 0.5rem;
}

.nav-sublist .nav-link.active::before {
  background: var(--accent-primary);
}
```

### Main Content

```css
.content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  padding: 2rem;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}
```

### Mobile Header

```css
.mobile-header {
  display: none;
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

.menu-toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s;
}

.mobile-logo {
  font-weight: 600;
  color: var(--text-primary);
  margin-left: 1rem;
}
```

### Mobile Responsive

```css
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-speed) ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-speed);
    z-index: 99;
  }

  .sidebar.open ~ .sidebar-overlay {
    opacity: 1;
    visibility: visible;
  }

  .content {
    margin-left: 0;
    padding-top: calc(var(--header-height) + 1rem);
  }
}
```

## JavaScript Functions

```javascript
// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  document.body.classList.toggle('sidebar-open');
}

// Toggle collapsible sections
function toggleSection(button) {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
}

// Set active link based on current URL
function setActiveLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');

      // Expand parent section if collapsed
      const section = link.closest('.nav-section');
      const header = section?.querySelector('.nav-section-header');
      if (header) {
        header.setAttribute('aria-expanded', 'true');
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', setActiveLink);
```

## Accessibility Considerations

1. **ARIA Labels**: Use `role="navigation"` and `aria-label` on the sidebar
2. **Keyboard Navigation**: Ensure all links are focusable and have visible focus states
3. **Expandable Sections**: Use `aria-expanded` to indicate section state
4. **Skip Link**: Consider adding a "Skip to content" link for keyboard users
5. **Focus Trap**: When mobile sidebar is open, trap focus within it

```html
<!-- Skip link at top of body -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Add to main content -->
<main id="main-content" class="content">
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--accent-primary);
  color: white;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
```

## Variations

### Icon-Only Collapsed Mode

```css
.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar.collapsed .logo-text,
.sidebar.collapsed .section-title,
.sidebar.collapsed .nav-link span {
  display: none;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
}
```

### With Search

```html
<div class="sidebar-search">
  <input type="search" placeholder="Search docs..." class="search-input">
</div>
```

### With User Profile

```html
<div class="sidebar-footer">
  <div class="user-profile">
    <img src="/avatar.jpg" alt="User" class="avatar">
    <div class="user-info">
      <span class="user-name">John Doe</span>
      <span class="user-role">Admin</span>
    </div>
  </div>
</div>
```

## Best Practices

1. **Keep it Scannable**: Use clear, concise link labels
2. **Logical Grouping**: Organize links into meaningful sections
3. **Visual Hierarchy**: Use indentation for nested items
4. **Current Location**: Always show active state
5. **Limit Depth**: Maximum 2-3 levels of nesting
6. **Consistent Width**: 240-300px is optimal for readability
7. **Scroll Indication**: Show scrollbar or fade when content overflows

## Related Skills

- [GitHub Pages Documentation](../github-pages-documentation/SKILL.md)
- [Dark Blue Theme](../dark-blue-theme/SKILL.md)
