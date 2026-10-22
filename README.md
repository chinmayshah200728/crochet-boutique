# crochetbyprisha

The current website source is in [cloudflare-store](./cloudflare-store).

Live storefront: https://crochetbyprisha.pages.dev/

It includes the animated crochet garden, per-part 3D colours, owner dashboard, customer accounts, manually verified UPI orders, and SEO/answer pages. See its README for building, testing and deploying the complete Cloudflare Pages Worker + D1 application.

The older Express/static application remains at the repository root for reference. Its static public-folder deployment does not include the current store backend. Do not use that older deployment configuration for the live storefront.

No production database, passwords, private setup links or local Cloudflare credentials are included in the current app folder.

## Keeping GitHub current

Website edits are made in the sibling `crochetbyprisha-store` source. Run `node scripts/mirror-cloudflare-store.mjs` from this repository root to copy public source changes into `cloudflare-store/`. Review and test the resulting diff, then commit and publish it to GitHub. The scheduled Codex sync checks for changes regularly, and Codex website tasks should publish their changes immediately. Payment QR images, Cloudflare credentials, private setup links, and D1 customer/order records are excluded.
