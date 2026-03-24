# SkillVantage Coaching Platform - Design Style Guide

## Design Philosophy

### Visual Language
**AI-Centric Sophistication**: The design embodies the intersection of human expertise and artificial intelligence, creating an interface that feels both cutting-edge and approachable. We prioritize clean, purposeful design that reduces cognitive load while maintaining visual interest through subtle animations and thoughtful typography.

### Color Palette
**Primary Colors** (As specified in requirements):
- **Navy Blue (#001F3F)**: Trust, depth, intelligence - Used for primary navigation, headers, and key interactive elements
- **Orange (#FF6600)**: Energy, progress, motivation - Applied to CTAs, progress indicators, and accent elements
- **White (#FFFFFF)**: Simplicity, clarity, balance - Background and content areas

**Supporting Palette**:
- **Light Navy (#1A3A5C)**: Secondary navigation and card backgrounds
- **Light Orange (#FF8533)**: Hover states and secondary actions
- **Cool Gray (#F8F9FA)**: Subtle backgrounds and dividers
- **Success Green (#28A745)**: Achievement indicators and positive feedback
- **Warning Amber (#FFC107)**: Attention states and pending actions

### Typography
**Primary Font**: Inter (Sans-serif) - Clean, modern, highly legible for digital interfaces
**Display Font**: Poppins (Sans-serif) - Bold, confident headings that convey authority
**Monospace**: JetBrains Mono - For data displays and technical information

**Hierarchy**:
- H1: 48px Poppins Bold - Hero headlines
- H2: 36px Poppins SemiBold - Section headers
- H3: 24px Poppins Medium - Subsection titles
- Body: 16px Inter Regular - Primary content
- Small: 14px Inter Regular - Secondary information
- Caption: 12px Inter Medium - Labels and metadata

## Visual Effects & Styling

### Core Libraries Integration
1. **Anime.js**: Smooth micro-interactions, button hovers, card reveals
2. **ECharts.js**: Interactive data visualizations with consistent color theming
3. **p5.js**: AI-inspired background particles and creative coding elements
4. **Pixi.js**: High-performance visual effects for dashboard animations
5. **Splitting.js**: Text animation effects for hero headlines
6. **Typed.js**: Typewriter effects for dynamic content display
7. **Splide.js**: Smooth carousels for testimonials and case studies

### Background Effects
**Primary**: Subtle particle system using p5.js - Floating geometric shapes that respond to mouse movement, representing AI neural networks
**Secondary**: Gradient mesh backgrounds with animated color transitions between navy and white
**Accent**: Orange glow effects around interactive elements and progress indicators

### Animation Principles
- **Purposeful Motion**: Every animation serves a functional purpose
- **Consistent Timing**: 200ms for micro-interactions, 400ms for transitions
- **Easing**: Custom cubic-bezier curves for natural movement
- **Performance**: GPU-accelerated transforms, 60fps target

### Header Effects
**Navigation**: Sticky header with subtle shadow on scroll, orange underline animation on hover
**Hero Section**: Typewriter animation for main headline, staggered fade-in for supporting content
**Background**: Animated gradient mesh with floating AI-inspired particles

### Interactive Elements
**Buttons**: 
- Primary: Navy background, white text, orange glow on hover
- Secondary: White background, navy border, orange text on hover
- CTA: Orange background, white text, scale transform on hover

**Cards**: 
- 3D tilt effect on hover with depth shadow
- Orange accent border appears on hover
- Content slides up with smooth transition

**Form Elements**:
- Clean, minimal styling with navy focus states
- Orange validation indicators
- Smooth transition animations

### Data Visualization Style
**Chart Colors**: Navy primary, Orange accent, Light gray secondary
**Animation**: Smooth data transitions, hover interactions
**Style**: Clean, minimal, with subtle shadows and rounded corners

### Responsive Design
**Mobile-First**: Optimized for touch interactions
**Breakpoints**: 
- Mobile: 320px-768px
- Tablet: 768px-1024px  
- Desktop: 1024px+

**Touch Targets**: Minimum 44px for all interactive elements
**Typography**: Scales appropriately across devices
**Layout**: Flexible grid system with consistent spacing

### Accessibility
**Contrast**: All text meets WCAG 2.1 AA standards (4.5:1 minimum)
**Focus States**: Clear orange outline for keyboard navigation
**Motion**: Respects prefers-reduced-motion settings
**Screen Readers**: Proper ARIA labels and semantic HTML

## Component Styling

### Dashboard Cards
- White background with subtle shadow
- Navy header with white text
- Orange progress indicators
- Hover: Lift with expanded shadow

### Progress Indicators
- Circular progress rings in orange
- Animated fill transitions
- Percentage text in navy

### Navigation
- Clean, minimal design
- Navy background with white text
- Orange active state indicators
- Smooth hover transitions

### Modal Dialogs
- Centered with backdrop blur
- White background, navy border
- Orange primary actions
- Smooth scale-in animation

This design system creates a cohesive, professional appearance that builds trust while showcasing the platform's AI capabilities through subtle but impactful visual effects.