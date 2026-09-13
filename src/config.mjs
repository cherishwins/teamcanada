// The one place the public origin is written down. Everything else — canonicals,
// OG tags, sitemap, manifest, structured data — reads it from here, so moving
// domains is a one-line change rather than a find-and-replace across the site.
export const SITE = {
  origin: 'https://northerntemper.ca',
  name: 'Northern Temper',
  tagline: 'A statement of Canadian character',
  locale: 'en-CA',
  author: 'Jesse James',
  email: 'jesse@northerntemper.ca',
  licence: 'CC0-1.0',
};

/** Absolute URL for a site-relative path. */
export const abs = (path = '/') => new URL(path, SITE.origin).href;
