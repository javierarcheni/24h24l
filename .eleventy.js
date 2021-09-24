const htmlmin = require("html-minifier");
const Image = require("@11ty/eleventy-img");
const path = require('path');
const svgContents = require("eleventy-plugin-svg-contents");
const pluginSEO = require("eleventy-plugin-seo");

async function imageShortcode(src, alt, clases, sizes = "100vw") {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [800],
    formats: ['webp', 'jpeg'],
    urlPath: "/images/",
    outputDir: "./public/images/",
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src)
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`
    }
  });

  let lowsrc = metadata.jpeg[0]
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1]

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
  }).join("\n")}
    <img
      src="${lowsrc.url}"
      width="${highsrc.width}"
      height="${highsrc.height}"
      alt="${alt}"
      class="${clases}"
      loading="lazy"
      decoding="async">
  </picture>`;
}


module.exports = function (eleventyConfig) {


  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");

  // dependencias externas 
  eleventyConfig.addPassthroughCopy("vendor");


  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addShortcode("year", function () {
    return String(new Date().getFullYear());
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {

    if (
      process.env.npm_lifecycle_event == 'build' &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addPlugin(svgContents);

  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/seo.json"));

  return {
    dir: {
      input: "src",
      output: "public"
    }
  }

}