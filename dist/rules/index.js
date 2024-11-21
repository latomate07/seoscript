export const titleRule = {
    id: 'title',
    name: 'Title Tag',
    description: 'Checks if the page has a title tag and its length',
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
        return {
            passed: true,
            score: 10,
            message: 'Title tag is present and has optimal length',
        };
    },
};
export const metaDescriptionRule = {
    id: 'meta-description',
    name: 'Meta Description',
    description: 'Checks if the page has a meta description and its length',
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
export const rules = [titleRule, metaDescriptionRule];
