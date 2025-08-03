
export function getStoryblokVersion() {
  if (import.meta.env.DEV) {
    return 'draft'; // local dev always draft
  }
  if (import.meta.env.VITE_ENVIRONMENT === 'preview') {
    return 'draft'; // Netlify branch deploys or preview environments
  }
  return 'published'; // production builds
}

export function getStoryblokToken() {
  return getStoryblokVersion() === 'draft'
    ? import.meta.env.VITE_STORYBLOK_PREVIEW_API_TOKEN
    : import.meta.env.VITE_STORYBLOK_PUBLIC_API_TOKEN;
}
