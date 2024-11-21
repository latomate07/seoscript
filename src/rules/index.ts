import { SeoRule } from '../types/index.js';

// Rule: Title Tag
export const titleRule: SeoRule = {
  id: 'title',
  name: 'Title Tag',
  description: 'Checks if the page has a title tag, its length, and uniqueness.',
  weight: 10,
  validate: (content: string) => {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);

    if (!titleMatch) {
      return {
        passed: false,
        score: 0,
        message: 'No title tag found',
      };
    }

    const titleContent = titleMatch[1].trim();
    const titleLength = titleContent.length;

    if (titleLength < 10 || titleLength > 60) {
      return {
        passed: false,
        score: 5,
        message: `Title length (${titleLength}) is not optimal (should be between 10-60 characters)`,
        details: [`Current title: "${titleContent}"`],
      };
    }

    const isUnique = !content.match(new RegExp(`<title>\\s*${titleContent}\\s*</title>`, 'gi'))?.length;
    if (!isUnique) {
      return {
        passed: false,
        score: 5,
        message: 'Title tag is duplicated across the page',
      };
    }

    return {
      passed: true,
      score: 10,
      message: 'Title tag is present, has optimal length, and is unique',
    };
  },
};

// Rule: Meta Description
export const metaDescriptionRule: SeoRule = {
  id: 'meta-description',
  name: 'Meta Description',
  description: 'Checks if the page has a meta description and its length.',
  weight: 8,
  validate: (content: string) => {
    const descMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);

    if (!descMatch) {
      return {
        passed: false,
        score: 0,
        message: 'No meta description found',
      };
    }

    const descContent = descMatch[1].trim();
    const descLength = descContent.length;

    if (descLength < 50 || descLength > 160) {
      return {
        passed: false,
        score: 4,
        message: `Meta description length (${descLength}) is not optimal (should be between 50-160 characters)`,
        details: [`Current description: "${descContent}"`],
      };
    }

    return {
      passed: true,
      score: 8,
      message: 'Meta description is present and has optimal length',
    };
  },
};

// Rule: Image Alt Attributes
export const imageAltRule: SeoRule = {
  id: 'image-alt',
  name: 'Image Alt Attributes',
  description: 'Checks if all images have alt attributes.',
  weight: 6,
  validate: (content: string) => {
    const images = content.match(/<img [^>]*>/gi) || [];
    const missingAlts = images.filter((img) => !/alt=["'].*?["']/i.test(img));

    if (missingAlts.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 6 - missingAlts.length),
        message: `${missingAlts.length} image(s) are missing alt attributes`,
        details: missingAlts.map((img, index) => `Image ${index + 1}: ${img}`),
      };
    }

    return {
      passed: true,
      score: 6,
      message: 'All images have alt attributes',
    };
  },
};

// Rule: Header Tag Hierarchy
export const headerHierarchyRule: SeoRule = {
  id: 'header-hierarchy',
  name: 'Header Tag Hierarchy',
  description: 'Checks the logical order and presence of header tags (H1 to H6).',
  weight: 9,
  validate: (content: string) => {
    const headers = content.match(/<(h[1-6])[^>]*>.*?<\/\1>/gi) || [];
    const levels = headers.map((h) => parseInt(h.match(/<h([1-6])/i)?.[1] || '0', 10));

    if (levels.length === 0) {
      return {
        passed: false,
        score: 0,
        message: 'No header tags found on the page',
      };
    }

    if (levels[0] !== 1) {
      return {
        passed: false,
        score: 5,
        message: 'The first header tag is not an <h1>',
        details: [`First header tag found: <h${levels[0]}>`],
      };
    }

    for (let i = 0; i < levels.length - 1; i++) {
      if (levels[i + 1] > levels[i] + 1) {
        return {
          passed: false,
          score: 5,
          message: 'Header tags are not in a logical order',
          details: [`Issue found between <h${levels[i]}> and <h${levels[i + 1]}>`],
        };
      }
    }

    return {
      passed: true,
      score: 9,
      message: 'Header tags are present and follow a logical order',
    };
  },
};

// Rule: Canonical Tag
export const canonicalTagRule: SeoRule = {
  id: 'canonical-tag',
  name: 'Canonical Tag',
  description: 'Checks if the page has a canonical URL defined.',
  weight: 7,
  validate: (content: string) => {
    const canonicalMatch = content.match(/<link rel=["']canonical["'].*?>/i);
    if (!canonicalMatch) {
      return {
        passed: false,
        score: 0,
        message: 'No canonical tag found',
      };
    }
    return {
      passed: true,
      score: 7,
      message: 'Canonical tag is present',
    };
  },
};

// Rule: Robots Meta Tag
export const robotsMetaTagRule: SeoRule = {
  id: 'robots-meta-tag',
  name: 'Robots Meta Tag',
  description: 'Checks if the page has a robots meta tag with correct directives.',
  weight: 5,
  validate: (content: string) => {
    const robotsMatch = content.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    if (!robotsMatch) {
      return {
        passed: true, // Optional tag; passing if not present
        score: 5,
        message: 'Robots meta tag is not present, default indexing applies',
      };
    }
    const directives = robotsMatch[1].toLowerCase();
    if (/noindex|nofollow/.test(directives)) {
      return {
        passed: false,
        score: 0,
        message: `Robots meta tag contains directives that prevent indexing: "${directives}"`,
      };
    }
    return {
      passed: true,
      score: 5,
      message: 'Robots meta tag is present with correct directives',
    };
  },
};

// Rule: Viewport Meta Tag
export const viewportMetaTagRule: SeoRule = {
  id: 'viewport-meta-tag',
  name: 'Viewport Meta Tag',
  description: 'Checks if the page has a viewport meta tag for responsive design.',
  weight: 6,
  validate: (content: string) => {
    const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
    if (!viewportMatch) {
      return {
        passed: false,
        score: 0,
        message: 'Viewport meta tag is missing',
      };
    }
    return {
      passed: true,
      score: 6,
      message: 'Viewport meta tag is present',
    };
  },
};

// Rule: Open Graph Tags
export const openGraphRule: SeoRule = {
  id: 'open-graph-tags',
  name: 'Open Graph Tags',
  description: 'Checks if essential Open Graph meta tags are present.',
  weight: 5,
  validate: (content: string) => {
    const ogTitle = content.match(/<meta property=["']og:title["'].*?>/i);
    const ogDescription = content.match(/<meta property=["']og:description["'].*?>/i);
    const ogImage = content.match(/<meta property=["']og:image["'].*?>/i);

    const missingTags = [];
    if (!ogTitle) missingTags.push('og:title');
    if (!ogDescription) missingTags.push('og:description');
    if (!ogImage) missingTags.push('og:image');

    if (missingTags.length > 0) {
      return {
        passed: false,
        score: 5 - missingTags.length,
        message: `Missing Open Graph tag(s): ${missingTags.join(', ')}`,
      };
    }

    return {
      passed: true,
      score: 5,
      message: 'All essential Open Graph tags are present',
    };
  },
};

// Rule: Language Attribute
export const languageAttributeRule: SeoRule = {
  id: 'language-attribute',
  name: 'Language Attribute',
  description: 'Checks if the <html> tag has a valid lang attribute.',
  weight: 4,
  validate: (content: string) => {
    const langMatch = content.match(/<html[^>]*lang=["']([a-zA-Z-]+)["'][^>]*>/i);
    if (!langMatch) {
      return {
        passed: false,
        score: 0,
        message: 'No lang attribute found on <html> tag',
      };
    }
    const lang = langMatch[1];
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
      return {
        passed: false,
        score: 2,
        message: `Invalid lang attribute value: "${lang}"`,
      };
    }
    return {
      passed: true,
      score: 4,
      message: `Valid lang attribute found: "${lang}"`,
    };
  },
};

// Rule: Favicon Presence
export const faviconRule: SeoRule = {
  id: 'favicon',
  name: 'Favicon',
  description: 'Checks if a favicon is linked in the head section.',
  weight: 3,
  validate: (content: string) => {
    const faviconMatch = content.match(/<link[^>]*rel=["']icon["'][^>]*>/i);
    if (!faviconMatch) {
      return {
        passed: false,
        score: 0,
        message: 'No favicon link found',
      };
    }
    return {
      passed: true,
      score: 3,
      message: 'Favicon is present',
    };
  },
};

// Rule: Image Dimensions
export const imageDimensionsRule: SeoRule = {
  id: 'image-dimensions',
  name: 'Image Dimensions',
  description: 'Checks if images have width and height attributes to prevent layout shifts.',
  weight: 5,
  validate: (content: string) => {
    const images = content.match(/<img [^>]*>/gi) || [];
    const missingDimensions = images.filter(
      (img) => !/width=["']\d+["']/i.test(img) || !/height=["']\d+["']/i.test(img)
    );

    if (missingDimensions.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 5 - missingDimensions.length),
        message: `${missingDimensions.length} image(s) are missing width or height attributes`,
        details: missingDimensions.map((img, index) => `Image ${index + 1}: ${img}`),
      };
    }

    return {
      passed: true,
      score: 5,
      message: 'All images have width and height attributes',
    };
  },
};

// Rule: Structured Data (Schema.org)
export const structuredDataRule: SeoRule = {
  id: 'structured-data',
  name: 'Structured Data',
  description: 'Checks if structured data (JSON-LD) is present for rich results.',
  weight: 8,
  validate: (content: string) => {
    const jsonLdMatch = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>.*?<\/script>/is);
    if (!jsonLdMatch) {
      return {
        passed: false,
        score: 0,
        message: 'No structured data (JSON-LD) found',
      };
    }
    return {
      passed: true,
      score: 8,
      message: 'Structured data (JSON-LD) is present',
    };
  },
};

// Rule: Mobile-Friendly Viewport
export const mobileFriendlyRule: SeoRule = {
  id: 'mobile-friendly',
  name: 'Mobile-Friendly',
  description: 'Checks if the page is mobile-friendly (responsive design).',
  weight: 7,
  validate: (content: string) => {
    const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*["'][^>]*>/i);
    if (!viewportMatch) {
      return {
        passed: false,
        score: 0,
        message: 'Viewport meta tag for mobile devices is missing or incorrect',
      };
    }
    return {
      passed: true,
      score: 7,
      message: 'Page is mobile-friendly with correct viewport meta tag',
    };
  },
};

// Rule: HTTPS Usage
export const httpsUsageRule: SeoRule = {
  id: 'https-usage',
  name: 'HTTPS Usage',
  description: 'Checks if all resources are loaded over HTTPS.',
  weight: 6,
  validate: (content: string) => {
    const insecureResources = content.match(/<[^>]+(?:href|src)=["']http:\/\//gi) || [];
    if (insecureResources.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 6 - insecureResources.length),
        message: `${insecureResources.length} resource(s) are loaded over HTTP`,
        details: insecureResources.map((res, index) => `Resource ${index + 1}: ${res}`),
      };
    }
    return {
      passed: true,
      score: 6,
      message: 'All resources are loaded over HTTPS',
    };
  },
};

/// Rule: Internal Links
export const internalLinksRule: SeoRule = {
  id: 'internal-links',
  name: 'Internal Links',
  description: 'Checks internal links for descriptive anchor texts and valid URLs.',
  weight: 7,
  validate: (content: string) => {
    const internalLinks = content.match(/<a[^>]+href=["'](?!https?:\/\/)[^"']+["'][^>]*>.*?<\/a>/gi) || [];
    const issues = [];

    for (const link of internalLinks) {
      const anchorText = link.match(/>([^<]+)</)?.[1]?.trim();
      if (!anchorText || anchorText.toLowerCase() === 'click here' || anchorText.toLowerCase() === 'read more') {
        issues.push(`Non-descriptive anchor text: "${anchorText}" in ${link}`);
      }
      
      const href = link.match(/href=["']([^"']+)["']/)?.[1];
      if (href && (href === '#' || href === 'javascript:void(0)')) {
        issues.push(`Invalid or empty href: "${href}" in ${link}`);
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 7 - issues.length),
        message: `${issues.length} internal link issue(s) found`,
        details: issues,
      };
    }

    return {
      passed: true,
      score: 7,
      message: 'All internal links have descriptive anchor texts and valid URLs',
    };
  },
};

// Rule: Content Length
export const contentLengthRule: SeoRule = {
  id: 'content-length',
  name: 'Content Length',
  description: 'Checks if the page has sufficient unique content.',
  weight: 8,
  validate: (content: string) => {
    // Extract text content from the HTML
    const textContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const wordCount = textContent.split(/\s+/).length;

    if (wordCount < 300) {
      return {
        passed: false,
        score: 4,
        message: `Content is too thin (${wordCount} words). Minimum recommended is 300 words.`,
        details: ['Consider adding more unique, valuable content'],
      };
    }

    return {
      passed: true,
      score: 8,
      message: `Content length is good (${wordCount} words)`,
    };
  },
};

// Rule: Keywords Density
export const keywordsDensityRule: SeoRule = {
  id: 'keywords-density',
  name: 'Keywords Density',
  description: 'Analyzes keyword density and potential keyword stuffing.',
  weight: 6,
  validate: (content: string) => {
    // Extract text content
    const textContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();

    const words = textContent.split(/\s+/);
    const totalWords = words.length;
    
    // Create word frequency map
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 3) { // Ignore small words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Find words with high density
    const highDensityWords = Object.entries(wordFreq)
      .filter(([_, count]) => (count / totalWords) > 0.05) // More than 5% density
      .map(([word, count]) => `"${word}" (${((count / totalWords) * 100).toFixed(1)}%)`);

    if (highDensityWords.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 6 - highDensityWords.length),
        message: 'Potential keyword stuffing detected',
        details: [
          'Words with unusually high density:',
          ...highDensityWords,
        ],
      };
    }

    return {
      passed: true,
      score: 6,
      message: 'Keyword density is natural and well-distributed',
    };
  },
};

// Rule: Social Media Tags
export const socialMediaTagsRule: SeoRule = {
  id: 'social-media-tags',
  name: 'Social Media Tags',
  description: 'Checks for presence of Twitter Cards and other social media meta tags.',
  weight: 5,
  validate: (content: string) => {
    const requiredTags = [
      { name: 'twitter:card', regex: /<meta[^>]*name=["']twitter:card["'][^>]*>/i },
      { name: 'twitter:title', regex: /<meta[^>]*name=["']twitter:title["'][^>]*>/i },
      { name: 'twitter:description', regex: /<meta[^>]*name=["']twitter:description["'][^>]*>/i },
      { name: 'twitter:image', regex: /<meta[^>]*name=["']twitter:image["'][^>]*>/i }
    ];

    const missingTags = requiredTags.filter(tag => !tag.regex.test(content));

    if (missingTags.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 5 - missingTags.length),
        message: 'Missing social media meta tags',
        details: missingTags.map(tag => `Missing ${tag.name}`),
      };
    }

    return {
      passed: true,
      score: 5,
      message: 'All essential social media meta tags are present',
    };
  },
};

// Rule: URL Structure
export const urlStructureRule: SeoRule = {
  id: 'url-structure',
  name: 'URL Structure',
  description: 'Analyzes URL structure for SEO best practices.',
  weight: 6,
  validate: (content: string) => {
    const canonical = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    if (!canonical) {
      return {
        passed: false,
        score: 3,
        message: 'No canonical URL found to analyze',
      };
    }

    const url = canonical[1];
    const issues = [];

    // Check for uppercase characters
    if (/[A-Z]/.test(url)) {
      issues.push('URL contains uppercase characters');
    }

    // Check for special characters
    if (/[^a-zA-Z0-9-_/.]/.test(url)) {
      issues.push('URL contains special characters');
    }

    // Check for multiple consecutive hyphens
    if (/--/.test(url)) {
      issues.push('URL contains consecutive hyphens');
    }

    // Check for very long URL
    if (url.length > 100) {
      issues.push('URL is too long (over 100 characters)');
    }

    if (issues.length > 0) {
      return {
        passed: false,
        score: Math.max(0, 6 - issues.length),
        message: 'URL structure issues found',
        details: issues,
      };
    }

    return {
      passed: true,
      score: 6,
      message: 'URL structure follows SEO best practices',
    };
  },
};

// Add new rules to the rules array
export const rules: SeoRule[] = [
  titleRule,
  metaDescriptionRule,
  imageAltRule,
  headerHierarchyRule,
  canonicalTagRule,
  robotsMetaTagRule,
  viewportMetaTagRule,
  openGraphRule,
  languageAttributeRule,
  faviconRule,
  imageDimensionsRule,
  structuredDataRule,
  mobileFriendlyRule,
  httpsUsageRule,
  internalLinksRule,
  contentLengthRule,
  keywordsDensityRule,
  socialMediaTagsRule,
  urlStructureRule,
];