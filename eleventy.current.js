module.exports = function(eleventyConfig) {


    eleventyConfig.addPassthroughCopy({"src/assets/css/main.css": "assets/css/main.css"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/breakpoints.min.js": "/assets/jsbreakpoints.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/browser.min.js": "/assets/js/browser.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/jquery.min.js": "/assets/js/jquery.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/main.js" : "/assets/js/main.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/util.js" : "/assets/js/util.js"});
    eleventyConfig.addPassthroughCopy({"assets/css/fontawesome-all.min.css": "all.min.css"});

    eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });

    eleventyConfig.addPassthroughCopy({"src/assets/images": '/assets/images'});

    eleventyConfig.addPassthroughCopy("src/admin/");

    eleventyConfig.addDataExtension('json', (contents) => {
        return JSON.parse(contents);
      });

      eleventyConfig.addFilter("customDateFormat", function(value, format) {
        return new Date(value).toLocaleDateString(undefined, { dateStyle: format })});
      
      eleventyConfig.addFilter("dateIso", function(value) {
        return new Date(value).toISOString().split('T')[0];
      });
    
    eleventyConfig.addCollection('blogPosts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_posts/*.md');
    });

    // Create a filtered collection for the main blog feed (excludes hidden posts and state-specific pages)
    eleventyConfig.addCollection('blogPostsPublic', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_posts/*.md').filter(post => {
            return !post.data.tags || !post.data.tags.includes('hidden');
        });
    });

    // Create a collection for general blog posts (only featured posts)
    eleventyConfig.addCollection('generalBlogPosts', function (collectionApi) {
        const allPosts = collectionApi.getFilteredByGlob('src/_posts/*.md');
        return allPosts.filter(post => {
            // Only include posts with the "featured" tag
            const hasFeaturedTag = post.data.tags && post.data.tags.includes('featured');
            
            // Exclude hidden posts
            const isHidden = post.data.tags && post.data.tags.includes('hidden');
            
            return hasFeaturedTag && !isHidden;
        });
    });

    // Create a collection for featured blog posts (only featured posts)
    eleventyConfig.addCollection('featuredBlogPosts', function (collectionApi) {
        const allPosts = collectionApi.getFilteredByGlob('src/_posts/*.md');
        return allPosts.filter(post => {
            // Only include posts with the "featured" tag
            const hasFeaturedTag = post.data.tags && post.data.tags.includes('featured');
            
            // Exclude hidden posts
            const isHidden = post.data.tags && post.data.tags.includes('hidden');
            
            return hasFeaturedTag && !isHidden;
        });
    });

    // Add date filter for better formatting
    eleventyConfig.addFilter('dateFilter', function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    // Add truncate filter for excerpts
    eleventyConfig.addFilter('truncate', function(str, length) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });

    // Add related posts collection
    eleventyConfig.addCollection('relatedPosts', function (collectionApi) {
        return function(currentPost, limit = 3) {
            const allPosts = collectionApi.getFilteredByGlob('src/_posts/*.md')
                .filter(post => {
                    const filename = post.inputPath.split('/').pop();
                    return post.url !== currentPost.url && 
                           !post.data.tags?.includes('hidden') &&
                           !filename.startsWith('landingAlt_');
                });
            
            // Find posts with similar tags
            const currentTags = currentPost.data.tags || [];
            const relatedPosts = allPosts
                .map(post => {
                    const postTags = post.data.tags || [];
                    const commonTags = currentTags.filter(tag => postTags.includes(tag));
                    return { post, score: commonTags.length };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(item => item.post);
            
            return relatedPosts;
        };
    });

    // Add heading ID filter for TOC
    eleventyConfig.addFilter('addHeadingIds', function(content) {
        return content.replace(
            /<h([2-4])>(.*?)<\/h([2-4])>/g,
            function(match, level, text) {
                const id = text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                return `<h${level} id="${id}">${text}</h${level}>`;
            }
        );
    });

    eleventyConfig.addCollection('faq', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/faq/*.md');
    });

    // Prevent FAQ markdown files from generating individual pages
    eleventyConfig.ignores.add('src/faq/*.md');

    // Prevent staff profile markdown files from generating individual pages
    eleventyConfig.ignores.add('src/staffProfiles/*.md');
    
    // Prevent posts in hold directory from generating individual pages
    eleventyConfig.ignores.add('src/hold/*.md');
    
    // Prevent components from generating individual pages
    eleventyConfig.ignores.add('src/_components/');
    eleventyConfig.ignores.add('src/_components/blogpreview.njk');

    // Add collection for location-specific pages
    eleventyConfig.addCollection('locationSpecific', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_locationspecific/*.md');
    });


    eleventyConfig.addCollection('staffProfiles', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/staffProfiles/*.md');
    });

    eleventyConfig.addCollection('tags', function(collectionApi) {
        const tagsSet = new Set();
        collectionApi.getAll().forEach(item => {
          if (item.data.tags) {
            item.data.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        return Array.from(tagsSet);
      });
    
      // Create filtered collections for each tag
      eleventyConfig.addCollection('taggedPosts', function(collectionApi) {
        const tags = collectionApi.getFilteredByTag('tags');
        const posts = collectionApi.getFilteredByTag('blogPosts');
    
        return tags.map(tag => {
          return {
            tag: tag,
            posts: posts.filter(post => post.data.tags && post.data.tags.includes(tag)),
          };
        });
      });

    return {
        dir: {
            input: 'src',
            includes: '_includes',
            components: '_components',
            partials: '_partials',
            output: '_site',
            layouts: "_layouts",
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk'
    };
};
