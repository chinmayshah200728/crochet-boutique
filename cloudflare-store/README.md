# crochetbyprisha

Live: https://crochetbyprisha.pages.dev/
Admin: https://crochetbyprisha.pages.dev/admin

React storefront, animated Three.js garden, Cloudflare Pages Worker and D1. Media uses D1 chunks with a 200 MB application cap; no R2 billing setup.

## Owner workflow

Complete the private, single-use setup link with username prishashah2809 and a password of at least 12 characters. Passwords use PBKDF2 hashing; owner sessions expire after eight hours. Setup codes and passwords must never be published. /admin.html redirects to /admin for old bookmarks.

All four restored products are samples with zero stock. Ordering stays paused until the owner adds actual product photos, prices, quantities and delivery/returns details, then enables orders in Settings. No fake reviews are included. Reviews are owner-entered genuine feedback with customer permission.

New product names containing bouquet, bow, scrunchie or gift set/hamper receive an illustrative 3D template automatically. Owners can select a style explicitly or upload a self-contained GLB (15 MB maximum) with named materials for each customisable part. Photo-to-3D reconstruction is not implemented. Unrecognised product shapes need an uploaded model or a chosen template.

The product editor saves starting colours per part. Customers can rotate/zoom, select each part and use a colour palette or any hex colour. Orders retain the immutable model URL and selected material colours; both the owner and customer can view that design even after catalogue edits.

## Customers and payments

Customer login is mandatory at checkout. Accounts have secure sessions, personal order history, password change and a one-time recovery code. Email verification and transactional mail are not configured; customers must keep their recovery code.

Payment uses the supplied Google Pay QR and UPI ID. Phone links target Google Pay or the installed UPI handler, subject to device support. Real-phone app launch and payment require a device test. A static QR does not necessarily prefill the order amount.

Submitting a reference never marks an order paid. The owner must check actual bank credit, enter the bank reference and matching amount, and explicitly confirm. The backend rejects reused bank references and blocks fulfilment without verified credit. This is manual reconciliation, not automatic bank/PSP verification. No system based on a personal QR alone can guarantee the absence of fraudulent payment claims.

## Development and deployment

- Types: node node_modules/typescript/bin/tsc --noEmit
- Build: node scripts/run-framework.mjs build
- Isolated integration checks: node --import ./scripts/sites-env.mjs scripts/check-worker.mjs
- If test fixtures are missing: node scripts/prepare-launch-qa.mjs (local only)
- Prepare: node scripts/prepare-pages.mjs
- Deploy: node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js pages deploy --project-name crochetbyprisha --branch main --cwd ../crochetbyprisha-pages

Apply migrations 0000–0006 before dependent code. check-worker uses a memory-only D1 database and the built Worker, testing account isolation, login requirements, order model snapshots, product starting colours, server totals, recovery/session revocation and payment verification guards. It creates no production orders or customers.

The sibling Pages staging directory avoids build-config auto discovery. Deploy the full Worker plus client assets: a static-only upload breaks the admin and API. Keep immutable GLB assets for existing orders. One-time implementation scripts are historical and should not be rerun.

Garden motion includes flowing surface normals, ripple geometry, wind-blown foliage, rowing, birds, ducks, butterflies, laundry and chimney smoke. It respects reduced motion and the scene pause button, and pauses offscreen rendering.

Three.js licence: public/vendor/three/LICENSE.

## Search and AI discovery

The homepage catalogue is server rendered. Each published product gets a stable linked page at /products/name--id with its own title, description and canonical URL. /about and /help provide visible, concise business and ordering answers. Organization/WebSite, FAQPage and eligible real-product schema reflect visible data; no ratings, addresses, delivery promises or returns guarantees are invented. Product offers are included only when ordering is open. Sample products are noindex and omitted from the dynamic sitemap; replace their preview wording when they become real products.

/sitemap.xml updates from the active catalogue. /robots.txt references it. Admin pages have noindex metadata and headers; APIs remain protected by authentication. Scene/model helper pages are noindex. Product images are locally optimised WebP assets; social sharing has a 1200×630 preview. Search inclusion and AI citations are not guaranteed.

Remaining owner launch work: publish actual photos/product details, confirm delivery/return terms, open ordering only when ready, and verify ownership in Google Search Console and Bing Webmaster Tools, then submit https://crochetbyprisha.pages.dev/sitemap.xml. No Search Console/Bing account verification has been performed. A custom domain may be connected later; update lib/seo.ts, metadata canonicals, social URLs and host routing together when it changes.

Guidance used: https://developers.google.com/search/docs/appearance/ai-features and https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites . The implementation follows crawlability, visible useful text, accurate schema and internal linking; it makes no promises of rankings or AI recommendations.

## Fresh checkout

From this folder, run npm ci, then npm run build. Run node scripts/prepare-launch-qa.mjs followed by node --import ./scripts/sites-env.mjs scripts/check-worker.mjs for isolated checks. Copy cloudflare.settings.example.json to cloudflare.settings.json and fill it locally before deployment. Never commit the completed settings or setup code. Product/customer/order data is held in D1 and is not included in this repository. The studio payment QR is deliberately excluded; upload it through authenticated Settings on a new installation.

This source matches the current Pages application. The repository root contains an older Express/static implementation. Deploy using this folder's README; deploying the root public folder will omit the store API and admin backend.
