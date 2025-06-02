# Ephemeral Task Cards

Subtle, animated task cards that appear at the top of the home screen to show upcoming tasks. These cards animate in gently, remain visible briefly, then float upward and fade out without cluttering the UI.

## Features

- ✨ **Gentle Animations**: Cards slide in from top with blur effects, then float out smoothly
- 🎯 **Smart Prioritization**: Automatically sorts by urgency (overdue → due today → due soon) and priority
- ⏱️ **Configurable Timing**: Customizable visibility duration and stagger delays
- 🎨 **Beautiful Design**: Translucent cards with backdrop blur and elegant shadows
- 📱 **Mobile Optimized**: Responsive design that works on all screen sizes
- 🚫 **Non-Intrusive**: Positioned to not interfere with main camera CTA

## Components

### 1. EphemeralTaskCards (Framer Motion)

The main component using Framer Motion for sophisticated animations.

```tsx
import EphemeralTaskCards from '@/components/EphemeralTaskCards';

function CameraPage() {
  return (
    <div>
      <EphemeralTaskCards 
        maxCards={3}
        visibleDuration={3000}
        staggerDelay={400}
        tasks={yourTasksArray}
      />
      {/* Your camera interface */}
    </div>
  );
}
```

### 2. EphemeralTaskCardsCss (CSS-only)

A lighter alternative using pure CSS animations.

```tsx
import EphemeralTaskCardsCss from '@/components/EphemeralTaskCardsCss';

function CameraPage() {
  return (
    <div>
      <EphemeralTaskCardsCss 
        maxCards={3}
        visibleDuration={3000}
        staggerDelay={500}
      />
      {/* Your camera interface */}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxCards` | `number` | `3` | Maximum number of cards to show at once |
| `visibleDuration` | `number` | `3000` | How long each card stays visible (ms) |
| `staggerDelay` | `number` | `400-500` | Delay between each card animation (ms) |
| `tasks` | `Task[]` | Mock data | Array of tasks to display |

## Task Interface

```typescript
interface Task {
  id: number;
  title: string;
  room: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "overdue" | "due_today" | "due_soon" | "upcoming";
  daysOverdue?: number;
}
```

## Animation Phases

### Entry Animation
- Cards slide in from top (-60px) with scale (0.8) and blur effect
- Smooth cubic-bezier easing: `[0.25, 0.46, 0.45, 0.94]`
- Staggered timing for multiple cards

### Visible Phase
- Cards remain fully visible with progress indicator
- Subtle progress bar shows remaining time
- Non-interactive (pointer-events: none)

### Exit Animation
- Cards float upward (-120px) while fading out
- Slight scale reduction (0.9) and blur effect
- Custom exit easing: `[0.55, 0.055, 0.675, 0.19]`

## Visual Design

### Card Styling
```css
/* Translucent background with backdrop blur */
background: white/85
backdrop-filter: blur(24px)
border: white/30
border-radius: 16px

/* Layered shadows for depth */
box-shadow: 
  0 20px 40px rgba(0, 0, 0, 0.15),
  0 8px 24px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.2)
```

### Badge Colors
- **Overdue**: Red (bg-red-100, text-red-800)
- **Due Today**: Orange (bg-orange-100, text-orange-800)
- **Due Soon**: Yellow (bg-yellow-100, text-yellow-800)
- **Upcoming**: Blue (bg-blue-100, text-blue-800)

### Priority Icons
- **High**: `AlertTriangle` (red)
- **Medium**: `Clock` (yellow)
- **Low**: `CheckCircle2` (green)

## Usage Examples

### Basic Implementation
```tsx
// Simple usage with defaults
<EphemeralTaskCards />
```

### Customized Timing
```tsx
// Longer visibility with slower stagger
<EphemeralTaskCards 
  visibleDuration={5000}
  staggerDelay={600}
/>
```

### With Real Data
```tsx
// Using your actual task data
<EphemeralTaskCards 
  tasks={upcomingTasks}
  maxCards={2}
  visibleDuration={4000}
/>
```

### Mobile Responsive
```tsx
// Responsive card count
<EphemeralTaskCards 
  maxCards={window.innerWidth < 768 ? 2 : 3}
/>
```

## Integration Tips

1. **Camera Tab Priority**: Cards are positioned with `z-40` to appear above content but below modals
2. **Performance**: Cards show only once per page load to avoid repetitive animations
3. **Data Integration**: Replace mock data with your actual task management system
4. **Customization**: Modify colors, timings, and animations to match your design system

## Browser Support

- **Framer Motion Version**: Modern browsers with ES6+ support
- **CSS Version**: Supports `backdrop-filter` (iOS 9+, Chrome 76+, Safari 14+)
- **Fallbacks**: Graceful degradation for older browsers

## Accessibility

- Cards are decorative and use `pointer-events: none`
- Screen readers will ignore the animated cards
- Task information remains available in main task lists
- Reduced motion users see simpler animations

## Performance Notes

- Cards auto-cleanup after animation completion
- Minimal DOM impact with efficient cleanup
- CSS version has smaller bundle size
- Framer Motion version offers more sophisticated animations 