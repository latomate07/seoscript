"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = exports.httpsUsageRule = exports.mobileFriendlyRule = exports.structuredDataRule = exports.imageDimensionsRule = exports.faviconRule = exports.languageAttributeRule = exports.openGraphRule = exports.viewportMetaTagRule = exports.robotsMetaTagRule = exports.canonicalTagRule = exports.headerHierarchyRule = exports.imageAltRule = exports.metaDescriptionRule = exports.titleRule = void 0;
// Rule: Title Tag
exports.titleRule = {
    id: 'title',
    name: 'Title Tag',
    description: 'Checks if the page has a title tag, its length, and uniqueness.',
    weight: 10,
    validate: (content) => {
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
exports.metaDescriptionRule = {
    id: 'meta-description',
    name: 'Meta Description',
    description: 'Checks if the page has a meta description and its length.',
    weight: 8,
    validate: (content) => {
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
exports.imageAltRule = {
    id: 'image-alt',
    name: 'Image Alt Attributes',
    description: 'Checks if all images have alt attributes.',
    weight: 6,
    validate: (content) => {
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
exports.headerHierarchyRule = {
    id: 'header-hierarchy',
    name: 'Header Tag Hierarchy',
    description: 'Checks the logical order and presence of header tags (H1 to H6).',
    weight: 9,
    validate: (content) => {
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
exports.canonicalTagRule = {
    id: 'canonical-tag',
    name: 'Canonical Tag',
    description: 'Checks if the page has a canonical URL defined.',
    weight: 7,
    validate: (content) => {
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
exports.robotsMetaTagRule = {
    id: 'robots-meta-tag',
    name: 'Robots Meta Tag',
    description: 'Checks if the page has a robots meta tag with correct directives.',
    weight: 5,
    validate: (content) => {
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
exports.viewportMetaTagRule = {
    id: 'viewport-meta-tag',
    name: 'Viewport Meta Tag',
    description: 'Checks if the page has a viewport meta tag for responsive design.',
    weight: 6,
    validate: (content) => {
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
exports.openGraphRule = {
    id: 'open-graph-tags',
    name: 'Open Graph Tags',
    description: 'Checks if essential Open Graph meta tags are present.',
    weight: 5,
    validate: (content) => {
        const ogTitle = content.match(/<meta property=["']og:title["'].*?>/i);
        const ogDescription = content.match(/<meta property=["']og:description["'].*?>/i);
        const ogImage = content.match(/<meta property=["']og:image["'].*?>/i);
        const missingTags = [];
        if (!ogTitle)
            missingTags.push('og:title');
        if (!ogDescription)
            missingTags.push('og:description');
        if (!ogImage)
            missingTags.push('og:image');
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
exports.languageAttributeRule = {
    id: 'language-attribute',
    name: 'Language Attribute',
    description: 'Checks if the <html> tag has a valid lang attribute.',
    weight: 4,
    validate: (content) => {
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
exports.faviconRule = {
    id: 'favicon',
    name: 'Favicon',
    description: 'Checks if a favicon is linked in the head section.',
    weight: 3,
    validate: (content) => {
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
exports.imageDimensionsRule = {
    id: 'image-dimensions',
    name: 'Image Dimensions',
    description: 'Checks if images have width and height attributes to prevent layout shifts.',
    weight: 5,
    validate: (content) => {
        const images = content.match(/<img [^>]*>/gi) || [];
        const missingDimensions = images.filter((img) => !/width=["']\d+["']/i.test(img) || !/height=["']\d+["']/i.test(img));
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
exports.structuredDataRule = {
    id: 'structured-data',
    name: 'Structured Data',
    description: 'Checks if structured data (JSON-LD) is present for rich results.',
    weight: 8,
    validate: (content) => {
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
exports.mobileFriendlyRule = {
    id: 'mobile-friendly',
    name: 'Mobile-Friendly',
    description: 'Checks if the page is mobile-friendly (responsive design).',
    weight: 7,
    validate: (content) => {
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
exports.httpsUsageRule = {
    id: 'https-usage',
    name: 'HTTPS Usage',
    description: 'Checks if all resources are loaded over HTTPS.',
    weight: 6,
    validate: (content) => {
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
// Ajouter les nouvelles règles à votre ensemble de règles
exports.rules = [
    exports.titleRule,
    exports.metaDescriptionRule,
    exports.imageAltRule,
    exports.headerHierarchyRule,
    exports.canonicalTagRule,
    exports.robotsMetaTagRule,
    exports.viewportMetaTagRule,
    exports.openGraphRule,
    exports.languageAttributeRule,
    exports.faviconRule,
    exports.imageDimensionsRule,
    exports.structuredDataRule,
    exports.mobileFriendlyRule,
    exports.httpsUsageRule,
];
