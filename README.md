cf-visitor-router
=================

A lightweight Cloudflare Worker that routes visitors to different backends
based on their geographic location.

This project is designed especially for improving website access speed
for users in Mainland China, while keeping global users on the main site.

Features
--------
- Route visitors based on country or region
- Two working modes:
  - Redirect mode (301 / 302)
  - Proxy mode (no redirect, SEO friendly)
- Rule-based configuration
- No external dependencies
- Works with Cloudflare Workers and Pages

Routing Modes
-------------

1. Redirect Mode (Simple)

Redirects visitors to different domains using HTTP status codes.

Advantages:
- Very simple to deploy
- Suitable for Cloudflare Pages

Disadvantages:
- URL changes
- Extra redirect latency

Source file:
src/redirect-router.js

2. Proxy Mode (Recommended)

Acts as a reverse proxy and keeps the original URL unchanged.

Advantages:
- Faster first content paint
- Better SEO
- No visible redirect

Disadvantages:
- Slightly more complex logic

Source file:
src/proxy-router.js

Configuration
-------------

Routing rules are defined as an array:

Example:

const ROUTES = [
  {
    match: ['CN'],
    upstream: 'https://cn.example.com'
  },
  {
    match: ['HK', 'TW', 'MO'],
    upstream: 'https://hk.example.com'
  },
  {
    match: ['*'],
    upstream: 'https://www.example.com'
  }
]

Explanation:
- match: ISO 3166-1 alpha-2 country codes
- '*' means fallback rule

SEO Strategy (Proxy Mode)
------------------------

- All regions share the same URL
- Canonical header is unified
- Prevents duplicate indexing by search engines

Deployment
----------

Using Wrangler:

1. Install Wrangler
   npm install -g wrangler

2. Login to Cloudflare
   wrangler login

3. Deploy
   wrangler deploy

Bind your custom domain to the Worker in the Cloudflare Dashboard.

Use Cases
---------

- Static blogs (Hexo, Hugo, VitePress)
- Cloudflare Pages acceleration for Mainland China
- Multi-region site routing
- Geo-based traffic optimization

License
-------

MIT License
