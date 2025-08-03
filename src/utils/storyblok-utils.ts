export function getStoryblokVersion() {
  return import.meta.env.VITE_STORYBLOK_VERSION || 'published';
}

export function getStoryblokToken() {
  return getStoryblokVersion() === 'draft'
    ? import.meta.env.VITE_STORYBLOK_PREVIEW_API_TOKEN
    : import.meta.env.VITE_STORYBLOK_PUBLIC_API_TOKEN;
}
