# Images

The storefront uses product photography in `frontend/public/images/products/` and hero photography for the home hero, collection cards, and the "Gifts that sparkle" offer in `frontend/public/images/hero/`. Original SVG artwork remains available as placeholder imagery.

## Where images live

```
frontend/public/images/
  favicon.ico                browser tab favicon
  favicon-16x16.png          16px browser favicon
  favicon-32x32.png          32px browser favicon
  apple-touch-icon.png       Apple home-screen icon
  android-chrome-192x192.png Android home-screen icon
  android-chrome-512x512.png Android home-screen icon
  site.webmanifest           installable app name, icons, and theme
  hero/a lipstick beside gold jewelry.jfif  home hero photo
  hero/liips.jfif         Lips collection thumbnail
  hero/eyes and face.jfif Eyes & Face collection thumbnail
  hero/jewelry.jfif       Jewelry collection thumbnail
  hero/sparkle.jfif       "Gifts that sparkle" offer banner
  hero/offer.svg           original offer-banner placeholder artwork
  collections/*.svg        three tall collection tiles (~800x1000)
  products/<slug>.jfif     product photos, matched by slug in the seed data
```

Anything in `frontend/public/` is served from the site root. Image files are available under `/images/...`; the HTML head links the favicon assets and web manifest.

## Swapping in real photos

1. Export photos as **WebP** (or JPG/JFIF), square for products, and keep each under ~200 KB.
   ```bash
   cwebp -q 80 -resize 1200 1200 input.jpg -o frontend/public/images/products/velvet-lipstick.webp
   ```
2. Update the paths in `backend/prisma/seed.ts` if product image filenames change.
3. Run `npm run db:seed` in `backend` to update image paths for existing products. This does not reset products, carts, or orders.
4. For hero/collection images, edit the image URLs in `frontend/src/pages/Home.tsx`.

## Photography tips for this niche

- Makeup: consistent background colour, soft side lighting, one swatch shot per shade as a second image.
- Jewelry: macro shots on neutral backgrounds; show scale on a model for at least the hero image.
- Use the same aspect ratio for every product so the grid stays tidy.
- Only use images you own or have a licence for (your own photos, or Unsplash/Pexels with their licence terms).

## Later: a CDN

When you outgrow `public/`, upload to Cloudinary or S3 + CloudFront and store full URLs in `Product.imageUrl`. The UI already accepts absolute URLs.
