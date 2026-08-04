/**
 * SEO Metadata for all pages and tools
 * Last Modified dates and priorities for sitemap generation
 */

export interface PageMetadata {
  route: string;
  lastModified: string; // ISO date format YYYY-MM-DD
  priority: number; // 0.0 to 1.0
  isPopular?: boolean;
}

export const PAGE_METADATA: Record<string, PageMetadata> = {
  // Homepage
  '/': {
    route: '/',
    lastModified: '2026-07-21',
    priority: 1.0
  },

  // Company Pages
  '/about': {
    route: '/about',
    lastModified: '2026-08-04',
    priority: 0.6
  },
  '/contact': {
    route: '/contact',
    lastModified: '2026-08-04',
    priority: 0.5
  },

  // Category Pages
  '/categories/pdf': {
    route: '/categories/pdf',
    lastModified: '2026-07-21',
    priority: 0.9
  },
  '/categories/images': {
    route: '/categories/images',
    lastModified: '2026-07-21',
    priority: 0.9
  },
  '/categories/text': {
    route: '/categories/text',
    lastModified: '2026-07-21',
    priority: 0.9
  },
  '/categories/developer': {
    route: '/categories/developer',
    lastModified: '2026-07-21',
    priority: 0.9
  },

  // PDF Tools - Popular ones marked
  '/categories/pdf/merge-pdf': {
    route: '/categories/pdf/merge-pdf',
    lastModified: '2026-07-15',
    priority: 0.8,
    isPopular: true
  },
  '/categories/pdf/split-pdf': {
    route: '/categories/pdf/split-pdf',
    lastModified: '2026-07-15',
    priority: 0.8,
    isPopular: true
  },
  '/categories/pdf/compress-pdf': {
    route: '/categories/pdf/compress-pdf',
    lastModified: '2026-07-15',
    priority: 0.8,
    isPopular: true
  },
  '/categories/pdf/rotate-pdf': {
    route: '/categories/pdf/rotate-pdf',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/pdf/jpg-to-pdf': {
    route: '/categories/pdf/jpg-to-pdf',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/pdf/pdf-to-jpg': {
    route: '/categories/pdf/pdf-to-jpg',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/pdf/unlock-pdf': {
    route: '/categories/pdf/unlock-pdf',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/pdf/protect-pdf': {
    route: '/categories/pdf/protect-pdf',
    lastModified: '2026-07-10',
    priority: 0.7
  },

  // Image Tools - Popular ones marked
  '/categories/images/resize-image': {
    route: '/categories/images/resize-image',
    lastModified: '2026-07-15',
    priority: 0.8,
    isPopular: true
  },
  '/categories/images/compress-image': {
    route: '/categories/images/compress-image',
    lastModified: '2026-07-15',
    priority: 0.8,
    isPopular: true
  },
  '/categories/images/crop-image': {
    route: '/categories/images/crop-image',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/images/rotate-image': {
    route: '/categories/images/rotate-image',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/images/flip-image': {
    route: '/categories/images/flip-image',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/images/convert-image': {
    route: '/categories/images/convert-image',
    lastModified: '2026-07-12',
    priority: 0.7
  },
  '/categories/images/png-to-jpg': {
    route: '/categories/images/png-to-jpg',
    lastModified: '2026-07-12',
    priority: 0.7
  },
  '/categories/images/jpg-to-png': {
    route: '/categories/images/jpg-to-png',
    lastModified: '2026-07-12',
    priority: 0.7
  },
  '/categories/images/to-webp': {
    route: '/categories/images/to-webp',
    lastModified: '2026-07-12',
    priority: 0.7
  },
  '/categories/images/remove-bg': {
    route: '/categories/images/remove-bg',
    lastModified: '2026-07-15',
    priority: 0.8,
    isPopular: true
  },
  '/categories/images/watermark': {
    route: '/categories/images/watermark',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/images/filters': {
    route: '/categories/images/filters',
    lastModified: '2026-08-04',
    priority: 0.7
  },

  // Text Tools - Popular ones marked
  '/categories/text/word-counter': {
    route: '/categories/text/word-counter',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/character-counter': {
    route: '/categories/text/character-counter',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/case-converter': {
    route: '/categories/text/case-converter',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/remove-extra-spaces': {
    route: '/categories/text/remove-extra-spaces',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/reverse-text': {
    route: '/categories/text/reverse-text',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/sort-lines': {
    route: '/categories/text/sort-lines',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/duplicate-remover': {
    route: '/categories/text/duplicate-remover',
    lastModified: '2026-07-10',
    priority: 0.7
  },
  '/categories/text/find-replace': {
    route: '/categories/text/find-replace',
    lastModified: '2026-07-18',
    priority: 0.8,
    isPopular: true
  },
  '/categories/text/text-difference': {
    route: '/categories/text/text-difference',
    lastModified: '2026-07-20',
    priority: 0.8,
    isPopular: true
  },

  // Developer Tools - Recently updated
  '/categories/developer/json-formatter': {
    route: '/categories/developer/json-formatter',
    lastModified: '2026-07-19',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/json-validator': {
    route: '/categories/developer/json-validator',
    lastModified: '2026-07-19',
    priority: 0.7
  },
  '/categories/developer/xml-formatter': {
    route: '/categories/developer/xml-formatter',
    lastModified: '2026-07-19',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/html-formatter': {
    route: '/categories/developer/html-formatter',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/sql-formatter': {
    route: '/categories/developer/sql-formatter',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/sql-validator': {
    route: '/categories/developer/sql-validator',
    lastModified: '2026-07-21',
    priority: 0.7
  },
  '/categories/developer/base64': {
    route: '/categories/developer/base64',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/aes-encrypt': {
    route: '/categories/developer/aes-encrypt',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/des-encrypt': {
    route: '/categories/developer/des-encrypt',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/url-encode': {
    route: '/categories/developer/url-encode',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/hash': {
    route: '/categories/developer/hash',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/uuid': {
    route: '/categories/developer/uuid',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/jwt': {
    route: '/categories/developer/jwt',
    lastModified: '2026-07-21',
    priority: 0.8,
    isPopular: true
  },
  '/categories/developer/ascii-converter': {
    route: '/categories/developer/ascii-converter',
    lastModified: '2026-08-04',
    priority: 0.8,
    isPopular: true
  },
};

/**
 * Get metadata for a specific route
 */
export function getPageMetadata(route: string): PageMetadata | undefined {
  return PAGE_METADATA[route];
}

/**
 * Get all pages sorted by priority (highest first)
 */
export function getAllPagesSortedByPriority(): PageMetadata[] {
  return Object.values(PAGE_METADATA).sort((a, b) => b.priority - a.priority);
}
