module.exports = function(eleventyConfig) {


    eleventyConfig.addPassthroughCopy({"src/assets/css/main.css": "main.css"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/breakpoints.min.js": "/breakpoints.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/browser.min.js": "/browser.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/jquery.min.js": "/jquery.min.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/main.js" : "/main.js"});
    eleventyConfig.addPassthroughCopy({"src/assets/js/util.js" : "/util.js"});
    eleventyConfig.addPassthroughCopy({"assets/css/fontawesome-all.min.css": "all.min.css"});

    eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });

    // eleventyConfig.addPassthroughCopy('src/_posts/**/*.md');
    // eleventyConfig.addPassthroughCopy('src/_layouts/**/*.njk');
    // eleventyConfig.addPassthroughCopy('src/includes/**/*.njk');
    // eleventyConfig.addPassthroughCopy("src/assets/images");
    // eleventyConfig.addPassthroughCopy("src/assets/sass/");

    // assets/css/fontawesome-all.min.css

    eleventyConfig.addDataExtension('json', (contents) => {
        return JSON.parse(contents);
      });
    
    eleventyConfig.addCollection('blogPosts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_posts/*.md');
    });

    eleventyConfig.addCollection('staffProfiles', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/staffProfiles/*.md');
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
