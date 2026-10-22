# crochetbyprisha workflow

The live Cloudflare application source is in the sibling `crochetbyprisha-store` folder. This repository's `cloudflare-store/` is its public GitHub mirror. When changing the website, update the live source, run `node scripts/mirror-cloudflare-store.mjs` from this repository root, build and run the relevant checks, then publish the resulting Git change to `chinmayshah200728/crochet-boutique` in the same task. Do not finish a website change with GitHub behind.

The repository is public. Review `git diff` for secrets and customer data before publishing. Never commit `cloudflare.settings.json`, `.wrangler/`, private setup codes, passwords, database contents, or `public/art/payment-qr.jpg`. The mirror script deliberately excludes private settings and the payment QR. Keep the old root app as reference; the current app is `cloudflare-store/`.

If Git CLI authentication is unavailable, use the connected GitHub tool to create blobs, a tree, a commit and update the branch. Verify the remote tree matches the reviewed local tree. If publication fails, state clearly that the GitHub update is pending.
