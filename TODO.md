# TODO

## Later

- fix events , cal "icons"
- manifest screenshots wide.
- re-design
  - events -> trainings
- image optimisation: width and heights from image?
- remove old astro components
- remove old sb blocks

“As a side project, I designed and developed a product site for a fictional bike brand based on a real gear concept. I chose Astro with Vue for performance and flexibility, used SCSS for styling, and built a modular, CMS-like content system using Astro collections. I focused on component structure, responsive design, and content modeling — all aligned with the kind of workflow your team values.”

2. Proxy images through your domain (if dynamic resizing is needed)
   You can create an Astro endpoint like /image-proxy that fetches Storyblok images server-side and strips cookies before sending them to the client.

Astro Endpoint example:

ts
Copy
Edit
// src/pages/image-proxy.ts
export async function GET({ url }) {
const target = new URL(url.searchParams.get("url") || "");
const res = await fetch(target);
const headers = new Headers(res.headers);

// Remove any Set-Cookie headers
headers.delete("set-cookie");

return new Response(res.body, {
headers,
status: res.status,
});
}
Usage:

html
Copy
Edit
<img src="/image-proxy?url=https://a.storyblok.com/xyz.jpg" />

/_ Single screenshot _/
"screenshots": [
{
"src": "desktop.webp",
"sizes": "1280x720",
"type": "image/webp"
}
]

/_ Two screenshots _/
"screenshots": [
{
"src": "screenshots/home.webp",
"sizes": "1280x720",
"type": "image/webp",
"form_factor": "wide",
"label": "Home screen showing main navigation and featured content"
},
{
"src": "screenshots/dashboard.webp",
"sizes": "1280x720",
"type": "image/webp",
"platform": "ios",
"label": "Dashboard view displaying key metrics"
}
]
