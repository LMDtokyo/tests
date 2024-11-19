export type Site = {
  TITLE: string
  DESCRIPTION: string
  EMAIL: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'PixelPulse',
  DESCRIPTION:
    'Freelance frontend web development and cybersecurity shenanigans.',
  EMAIL: 'letmedietokyo@icloud.com',
  NUM_POSTS_ON_HOMEPAGE: 2,
  POSTS_PER_PAGE: 4,
  SITEURL: '',
}

export const NAV_LINKS: Link[] = [
  { href: '/', label: 'home' },
  { href: '/blog', label: 'blog' },
  { href: '/authors', label: 'authors' },
  { href: '/about', label: 'about' },
  { href: '/tags', label: 'tags' },
  { href: '/books', label: 'books' },
  { href: '/news', label: 'news' },
  { href: '/me', label: 'me' },
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/LMDtokyo', label: 'GitHub' },
  { href: 'https://twitter.com/LMDtokyo', label: 'Twitter' },
  { href: 'letmedietokyo@icloud.com', label: 'Email' },
  { href: '/rss.xml', label: 'RSS' },
]
