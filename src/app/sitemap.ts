import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://meditrack.com'
  const locales = ['en', 'vi']
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/articles',
    '/login',
    '/terms'
  ]

  // Article pages (you would fetch these from your CMS/API)
  const articleSlugs = [
    'understanding-blood-test-results-guide',
    'importance-regular-health-checkups',
    'nutrition-tips-better-health',
    'exercise-mental-health-connection',
    'recovery-after-surgery-what-expect'
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Add static pages for each locale
  locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            vi: `${baseUrl}/vi${page}`,
          }
        }
      })
    })

    // Add article pages for each locale
    articleSlugs.forEach(slug => {
      sitemap.push({
        url: `${baseUrl}/${locale}/articles/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/articles/${slug}`,
            vi: `${baseUrl}/vi/articles/${slug}`,
          }
        }
      })
    })
  })

  return sitemap
}
