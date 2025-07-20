const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../src/_posts');
const IMAGES_DIR = path.join(__dirname, '../src/assets/images/blogimages');
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];

// 1. Get all markdown files in POSTS_DIR
const postFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

// 2. Get all available images from blogimages folder
const allImages = fs.readdirSync(IMAGES_DIR)
  .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
  .map(f => '/assets/images/blogimages/' + f);

console.log(`Found ${allImages.length} images in blogimages folder`);
console.log(`Found ${postFiles.length} blog posts`);

if (allImages.length < postFiles.length) {
  console.log(`Warning: Not enough images (${allImages.length}) for all posts (${postFiles.length})`);
}

// 3. Process each post and assign a unique image
let imageIndex = 0;
let changes = [];

for (const file of postFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(content);
  
  const oldThumbnail = data.thumbnail || 'none';
  const newThumbnail = allImages[imageIndex % allImages.length];
  
  // Update front matter
  const newData = { ...data, thumbnail: newThumbnail };
  const newContent = matter.stringify(markdownContent, newData);
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  changes.push({ 
    file, 
    old: oldThumbnail, 
    new: newThumbnail 
  });
  
  console.log(`Updated ${file}: ${oldThumbnail} -> ${newThumbnail}`);
  imageIndex++;
}

console.log(`\nSummary of changes:`);
changes.forEach(c => {
  console.log(`  ${c.file}: ${c.old} -> ${c.new}`);
});

console.log(`\nAll blog posts now use images from blogimages folder!`); 