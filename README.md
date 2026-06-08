# King's Lounge — Restaurant Website

A production-ready, luxury static website for **King's Lounge**, a premium family dining and BYOB restaurant in Walasmulla, Sri Lanka.

## Features

- **5 Pages**: Home, About, Menu, Gallery, Contact & Reservations
- **Mobile-first responsive design** — optimized for all screen sizes
- **Premium UI/UX** — dark charcoal & gold color palette with Poppins + Playfair Display typography
- **Smooth animations** — scroll reveal (Intersection Observer), loading screen, hero zoom
- **Interactive components** — testimonial slider, statistics counter, gallery lightbox with filters
- **Sticky navigation** — transparent on hero, dark on scroll with animated hamburger menu
- **SEO optimized** — meta tags, Open Graph, Schema.org Restaurant markup, semantic HTML
- **Accessible** — ARIA labels, keyboard navigation, reduced motion support
- **Performance** — lazy-loaded images, deferred scripts, optimized CSS

## File Structure

```
├── index.html          # Home page
├── about.html          # About us & BYOB experience
├── menu.html           # Full restaurant menu
├── gallery.html        # Masonry gallery with lightbox
├── contact.html        # Contact form & reservations
├── css/
│   ├── style.css       # Main styles
│   └── responsive.css  # Responsive breakpoints
├── js/
│   ├── main.js         # Navigation, animations, slider, form
│   └── gallery.js      # Gallery filters & lightbox
├── assets/
│   ├── images/         # Add your restaurant photos here
│   └── icons/
│       └── favicon.svg
└── README.md
```

## Quick Start

### Local Development

Open `index.html` directly in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

Visit `http://localhost:8000`

### Deployment

Deploy to any static hosting platform:

| Platform | Steps |
|----------|-------|
| **Netlify** | Drag & drop the folder, or connect your Git repo |
| **Vercel** | `vercel --prod` from project root |
| **GitHub Pages** | Push to repo, enable Pages in Settings |
| **AWS S3** | Upload files to bucket, enable static website hosting |

## Customization

### Contact Information

Update phone, email, and address in:
- All HTML footer sections
- `contact.html` contact details
- `index.html` Schema.org JSON-LD
- `js/main.js` — WhatsApp number (`94771234567`)

### Images

Replace Unsplash placeholder URLs with your own images in `assets/images/`:

```html
<!-- Before -->
<img src="https://images.unsplash.com/photo-..." alt="...">

<!-- After -->
<img src="assets/images/hero.jpg" alt="King's Lounge dining room">
```

Recommended image sizes:
- Hero backgrounds: 1920×1080px
- Menu items: 400×400px
- Gallery: varied (masonry layout)

### Google Maps

Replace the iframe `src` in `contact.html` with your exact location embed from [Google Maps](https://maps.google.com).

### Social Media

Update footer social links with your Facebook, Instagram, and TripAdvisor URLs.

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari, Chrome for Android
- Graceful degradation for older browsers

## Performance Tips

1. Replace external Unsplash URLs with locally hosted, compressed WebP images
2. Add a `og-image.jpg` (1200×630px) to `assets/images/` for social sharing
3. Enable gzip/brotli compression on your hosting provider
4. Consider a CDN for global delivery

## License

© 2026 King's Lounge. All rights reserved.

---

Built with HTML5, CSS3, and Vanilla JavaScript — no frameworks required.
