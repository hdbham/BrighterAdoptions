module.exports = function(eleventyConfig) {


    eleventyConfig.addPassthroughCopy({"src/assets/css/main.css": "assets/css/main.css"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/breakpoints.min.js": "/assets/js/breakpoints.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/browser.min.js": "/assets/js/browser.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/jquery.min.js": "/assets/js/jquery.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/main.js" : "/assets/js/main.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/util.js" : "/assets/js/util.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/css/fontawesome-all.min.css": "assets/css/fontawesome-all.min.css"});
    eleventyConfig.addPassthroughCopy({"src/assets/webfonts": "/assets/webfonts"});

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

    eleventyConfig.addCollection('generalBlogPosts', function (collectionApi) {
        const locationTags = ['utah', 'texas', 'florida', 'ohio', 'illinois', 'missouri', 'colorado', 'nevada', 'arizona', 'idaho', 'wyoming'];
        return collectionApi.getFilteredByGlob('src/_posts/*.md').filter(post => {
            if (!post.data.tags) return true;
            return !post.data.tags.some(tag => locationTags.includes(tag.toLowerCase()));
        });
    });

    // Add a collection for featured blog posts
    eleventyConfig.addCollection('featuredBlogPosts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_posts/*.md').filter(post => {
            return post.data.tags && post.data.tags.includes("featured");
        });
    });

    // Add a shuffle filter for randomizing arrays
    eleventyConfig.addFilter("shuffle", function(array) {
        if (!Array.isArray(array)) return array;
        
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    });

    // Add a some filter for checking if any element matches a condition
    eleventyConfig.addFilter("some", function(array, callback) {
        if (!Array.isArray(array)) return false;
        return array.some(callback);
    });

    // Add a filter to get only posts with the 'homepage' tag
    eleventyConfig.addFilter("hasHomepageTag", function(collection) {
      return collection.filter(post => post.data.tags && post.data.tags.includes("homepage"));
    });

    eleventyConfig.addCollection('faq', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/faq/*.md');
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

    eleventyConfig.addCollection('locationSpecific', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_locationspecific/*.md');
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
