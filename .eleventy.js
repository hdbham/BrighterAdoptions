module.exports = function(eleventyConfig) {


    eleventyConfig.addPassthroughCopy({"src/assets/css/main.css": "main.css"});
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
    
    eleventyConfig.addCollection('blogPosts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_posts/*.md');
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
