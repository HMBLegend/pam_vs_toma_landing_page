# PAM AI Website - Simplified Version

This is a simplified version of the PAM AI website with the key components extracted:

## Components Included

✅ **Header**
- Fixed navigation with logo
- Desktop and mobile navigation
- Login and Book Demo buttons
- Responsive mobile menu

✅ **Hero Section**
- Announcement badge
- Main headline and subtitle
- Call-to-action buttons
- Video demonstration

✅ **Trust Section**
- Marquee of brand logos
- Animated scrolling effect

✅ **Benefits Section**
- "Book More Service" card (20% revenue increase)
- "Sell More Cars" card (2x showroom visits)
- Feature lists with checkmarks

✅ **Dashboard Section**
- Transparent insights showcase
- Dashboard image display

✅ **Calendar Booking System**
- Embedded Calendly iframe
- Feature descriptions
- Loading animation

✅ **Footer**
- Company information
- Navigation links
- Social media links
- Copyright notice

## Files Structure

```
├── pam-simplified.html    # Main HTML file
├── pam-styles.css        # CSS styles
├── pam-scripts.js        # JavaScript functionality
└── assets/               # Images and media (you need to add these)
    ├── nav-logo.png
    ├── pam-dashboard.png
    ├── logo-placeholder.png
    └── favicon.ico
```

## Required Assets

You'll need to add these image files to make the website fully functional:

### Required Images:
1. **nav-logo.png** - PAM logo for header (120x37px recommended)
2. **pam-dashboard.png** - Dashboard screenshot
3. **logo-placeholder.png** - Brand logos for marquee section
4. **favicon.ico** - Website favicon

### Optional Assets:
- Individual brand logos (Audi, BMW, Honda, Mercedes, etc.)
- Additional images for features

## Setup Instructions

1. **Extract Images**: Copy the actual logos and images from the original PAM website files in `www.pamhq.com/_next/` folder

2. **Update Image Paths**: Replace placeholder image paths in the HTML with actual image files

3. **Customize Content**: Modify text, links, and styling as needed for your requirements

4. **Test Locally**: Open `pam-simplified.html` in a web browser to test

## Key Features

### Responsive Design
- Mobile-first approach
- Responsive breakpoints at 640px, 768px, and 1024px
- Touch-friendly navigation

### Interactive Elements
- Smooth scrolling navigation
- Mobile menu toggle
- Scroll effects on header
- Loading animations
- Intersection Observer animations

### Calendar Integration
- Embedded Calendly booking system
- Loading state management
- Responsive iframe

### Modern CSS
- CSS Custom Properties (CSS Variables)
- Flexbox and Grid layouts
- Modern color scheme matching PAM brand
- Smooth transitions and animations

## Customization

### Colors
Edit the CSS custom properties in `:root` to change the color scheme:

```css
:root {
    --primary-color: #6a2fec;
    --secondary-color: #6ABCF8;
    --service-bg: #a3f9e9;
    --sales-bg: #1a2642;
    /* ... other colors */
}
```

### Typography
The website uses Inter font from Google Fonts. You can change this in the CSS:

```css
--font-family: 'Your-Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Layout
Modify the grid layouts and spacing by editing the respective CSS classes.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with some fallbacks)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

1. Add the actual images from the PAM website
2. Test the calendar booking functionality
3. Customize colors, fonts, and content as needed
4. Add any additional sections or features
5. Optimize for production (minify CSS/JS, optimize images)

## Notes

- The calendar uses the existing PAM Calendly integration
- Video source points to the original PAM demo video
- All interactive elements are functional
- Ready for further customization and development

---

**Built for easy customization and modern web standards.** 