import { useStoryblokApi } from '@storyblok/astro'
import isPreview from './isPreview'

export default async function generateStaticPaths() {
  const storyblokApi = useStoryblokApi()
  const { data } = await storyblokApi.get('cdn/links', {
    version: isPreview() ? 'draft' : 'published',
  })
  let links = data.links
  links = Object.values(links)
  let paths = []

  links.forEach((link) => {
    // This slug will be used for fetching data from Storyblok
    let slug = link.slug === 'home' ? undefined : link.slug

    paths.push({
      props: { slug },
      params: {
        slug: slug || undefined,
      },
    })
  })

  return paths
}
