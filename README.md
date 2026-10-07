# Bond Technology Partners website

Static marketing site for [bondmsp.com](https://bondmsp.com). Plain HTML, CSS and JavaScript, with no build step.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Structure

- `index.html` – the single page, including meta tags and structured data
- `styles.css`, `script.js` – styles and behavior (bump the `?v=` number in `index.html` after editing so browsers fetch the new version)
- `assets/` – logos, icons, share image, partner logos and optimized media (AVIF/WebP/JPG, hero video)
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico` – SEO and browser files
- `_headers` – cache rules for Netlify or Cloudflare Pages
- `linkedin/` – LinkedIn banner and profile images (not used by the site)

## Contact form

Submissions open a pre-filled email to `partners@bondmsp.com` until `FORM_ENDPOINT` in `script.js` is set to a form service.
