module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/css/");
    eleventyConfig.addPassthroughCopy("src/assets/js/breakpoints.min.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/browser.min.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/jquery.min.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/main.js");
    eleventyConfig.addPassthroughCopy("src/assets/js/util.js");


    eleventyConfig.addPassthroughCopy("src/assets/images");
    eleventyConfig.addPassthroughCopy("src/assets/sass/");
    eleventyConfig.addPassthroughCopy("src/assets/webfonts/");
    eleventyConfig.addPassthroughCopy("./node_modules/@fortawesome/fontawesome-free/css/all.min.css");

    // const { exec } = require('child_process');
  
    // exec('npm run sass:build', (err, stdout, stderr) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log(stdout);
    // });


    return {
        dir: {
            input: 'src',
            includes: '_includes',
            components: '_components',
            partials: '_partials',
            output: '_site'
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk'
    };
};
