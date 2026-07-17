# Theme System - DataUtil

This document explains how to use the centralized theme variables and utility classes in the DataUtil application.

## 📁 File Structure

```
frontend/src/styles/
├── _variables.scss    # All theme variables, colors, typography, mixins
├── _utilities.scss    # Reusable utility classes
└── styles.scss        # Main stylesheet (imports variables & utilities)
```

## 🎨 Using Theme Variables

### In Component SCSS Files

Import the variables file at the top of your component SCSS:

```scss
@import 'styles/variables';

.my-component {
  color: $primary-blue;
  padding: $spacing-lg;
  border-radius: $radius-lg;
}
```

### Available Variables

#### Colors
```scss
// Primary Colors
$primary-blue         // #3b82f6 - Main brand color
$primary-blue-light   // #60a5fa - Hover states
$primary-blue-dark    // #2563eb - Active states

// Accent Colors
$accent-green         // Success states
$accent-red           // Error/danger states
$accent-yellow        // Warning states

// Text Colors (Light Mode)
$text-primary-light
$text-secondary-light
$text-tertiary-light

// Text Colors (Dark Mode)
$text-primary-dark
$text-secondary-dark
$text-tertiary-dark

// Background Colors
$bg-light             // #f8fafc
$bg-light-elevated    // #ffffff
$bg-dark              // #0f172a
$bg-dark-elevated     // #1e293b

// Border Colors
$border-light         // #e2e8f0
$border-dark          // #334155
```

#### Typography
```scss
// Font Sizes
$font-size-xs         // 12px
$font-size-sm         // 14px
$font-size-base       // 16px
$font-size-lg         // 18px
$font-size-xl         // 20px
$font-size-2xl        // 24px
$font-size-3xl        // 30px
$font-size-4xl        // 36px

// Font Weights
$font-weight-normal   // 400
$font-weight-medium   // 500
$font-weight-semibold // 600
$font-weight-bold     // 700
```

#### Spacing
```scss
$spacing-xs           // 4px
$spacing-sm           // 8px
$spacing-md           // 16px
$spacing-lg           // 24px
$spacing-xl           // 32px
$spacing-2xl          // 48px
$spacing-3xl          // 64px
```

#### Border Radius
```scss
$radius-sm            // 4px
$radius-md            // 6px
$radius-lg            // 8px
$radius-xl            // 12px
$radius-2xl           // 16px
$radius-full          // 9999px (fully rounded)
```

#### Shadows
```scss
$shadow-sm
$shadow-md
$shadow-lg
$shadow-xl
$shadow-2xl

// Dark mode shadows
$shadow-dark-sm
$shadow-dark-md
$shadow-dark-lg
```

#### Transitions
```scss
$transition-fast      // 150ms
$transition-base      // 200ms
$transition-slow      // 300ms

$ease-in-out          // cubic-bezier(0.4, 0, 0.2, 1)
```

## 🧰 Using Mixins

### Dark Mode Mixin

The easiest way to add dark mode styles:

```scss
.my-component {
  background-color: white;
  color: $gray-900;
  
  @include dark-mode {
    background-color: $gray-800;
    color: $gray-100;
  }
}
```

### Responsive Typography Mixins

```scss
h1 {
  @include heading-1;  // 36px on desktop, 30px on mobile
}

h2 {
  @include heading-2;  // 30px on desktop, 24px on mobile
}

h3 {
  @include heading-3;  // 24px on desktop, 20px on mobile
}
```

### Component Mixins

```scss
// Button
.my-button {
  @include btn-primary;
}

// Card
.my-card {
  @include card;
}

// Text Truncation
.truncated {
  @include truncate;
}

// Line Clamp (limit to N lines)
.description {
  @include line-clamp(3);
}
```

## 🎯 Using Utility Classes

Utility classes are available globally in templates without any imports.

### Buttons

```html
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
<button class="btn-outline">Outline Button</button>
<button class="btn-ghost">Ghost Button</button>

<!-- Size modifiers -->
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary btn-lg">Large</button>
```

### Cards

```html
<div class="card">
  Standard card with shadow
</div>

<div class="card-flat">
  Flat card with border
</div>

<div class="card-interactive">
  Interactive card with hover lift
</div>
```

### Links

```html
<a href="#" class="link-primary">Primary Link</a>
<a href="#" class="link-underline">Underlined Link</a>
```

### Badges

```html
<span class="badge-primary">Primary</span>
<span class="badge-success">Success</span>
<span class="badge-warning">Warning</span>
<span class="badge-danger">Danger</span>
```

### Input Fields

```html
<input type="text" class="input-field" placeholder="Enter text">
<input type="text" class="input-field input-error" placeholder="Error state">
```

### Loading States

```html
<div class="spinner-sm"></div>
<div class="spinner-md"></div>
<div class="spinner-lg"></div>

<div class="pulse">Pulsing element</div>

<div class="skeleton" style="height: 20px; width: 100%;"></div>
```

### Layout Utilities

```html
<div class="flex-center">Centered content</div>
<div class="flex-between">Space between</div>
<div class="flex-start">Flex start</div>
<div class="flex-end">Flex end</div>
```

### Text Utilities

```html
<p class="text-gradient">Gradient text effect</p>
<p class="truncate-text">Single line truncated...</p>
<p class="line-clamp-2">Text limited to 2 lines...</p>
<p class="line-clamp-3">Text limited to 3 lines...</p>
```

### Hover Effects

```html
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
<div class="hover-brightness">Brightens on hover</div>
```

### Scrollbar Utilities

```html
<div class="scrollbar-hide">Hidden scrollbar</div>
<div class="scrollbar-thin">Thin custom scrollbar</div>
```

### Glassmorphism

```html
<div class="glass">
  Glassmorphism effect
</div>
```

### Transitions

```html
<div class="transition-all">Transitions all properties</div>
<div class="transition-colors">Transitions colors only</div>
<div class="transition-transform">Transitions transform only</div>
```

## 🌓 Dark Mode Support

All utility classes automatically support dark mode. The dark mode is activated by adding the `.dark` class to the `<body>` element.

### In Components

Use the `:host-context(.dark)` selector or the `@include dark-mode` mixin:

```scss
// Using selector
:host-context(.dark) .my-element {
  color: $text-primary-dark;
}

// Using mixin (recommended)
.my-element {
  color: $text-primary-light;
  
  @include dark-mode {
    color: $text-primary-dark;
  }
}
```

## 📋 Best Practices

### DO ✅

- **Use theme variables** instead of hardcoded colors
  ```scss
  // Good
  color: $primary-blue;
  
  // Bad
  color: #3b82f6;
  ```

- **Use spacing variables** for consistent spacing
  ```scss
  // Good
  padding: $spacing-lg;
  
  // Bad
  padding: 24px;
  ```

- **Use mixins** for common patterns
  ```scss
  // Good
  @include btn-primary;
  
  // Bad
  background: #3b82f6;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  ```

- **Use utility classes** in templates when possible
  ```html
  <!-- Good -->
  <button class="btn-primary">Submit</button>
  
  <!-- Avoid custom styling when utility exists -->
  <button style="background: blue; padding: 10px;">Submit</button>
  ```

### DON'T ❌

- **Don't hardcode colors** - always use variables
- **Don't duplicate styles** - create a utility class or mixin
- **Don't forget dark mode** - always consider dark mode styling
- **Don't use inline styles** - use utility classes instead

## 🔄 Migration Guide

### Updating Existing Components

1. Import variables at the top:
   ```scss
   @import 'styles/variables';
   ```

2. Replace hardcoded colors:
   ```scss
   // Before
   color: #3b82f6;
   
   // After
   color: $primary-blue;
   ```

3. Replace hardcoded spacing:
   ```scss
   // Before
   padding: 24px;
   
   // After
   padding: $spacing-lg;
   ```

4. Add dark mode support:
   ```scss
   .my-component {
     background-color: white;
     
     @include dark-mode {
       background-color: $bg-dark-elevated;
     }
   }
   ```

5. Use utility classes in templates:
   ```html
   <!-- Before -->
   <div [style]="{'display': 'flex', 'justify-content': 'center'}">
   
   <!-- After -->
   <div class="flex-center">
   ```

## 📚 Additional Resources

- See [_variables.scss](./src/styles/_variables.scss) for complete variable list
- See [_utilities.scss](./src/styles/_utilities.scss) for all utility classes
- See [Tailwind CSS Documentation](https://tailwindcss.com/docs) for Tailwind utilities

---

**Note:** This theme system works alongside Tailwind CSS. Use Tailwind utilities for standard spacing/layout, and use these custom variables/utilities for brand-specific styling and dark mode support.
