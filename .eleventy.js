module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/css/");
    eleventyConfig.addPassthroughCopy("src/assets/js/breakpoints.min.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/browser.min.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/jquery.min.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/main.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/util.js");
    eleventyConfig.addPassthroughCopy('src/_posts/**/*.md');
    eleventyConfig.addPassthroughCopy('src/_layouts/**/*.njk');
    eleventyConfig.addPassthroughCopy('src/includes/**/*.njk');

    eleventyConfig.addPassthroughCopy("src/assets/images");
    eleventyConfig.addPassthroughCopy("src/assets/sass/");
    eleventyConfig.addPassthroughCopy("./node_modules/@fortawesome/fontawesome-free/css/all.min.css");


    eleventyConfig.addCollection('blogPosts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('src/_posts/*.md');
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
