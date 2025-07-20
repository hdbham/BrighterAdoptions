const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../src/_posts');
const IMAGES_DIR = path.join(__dirname, '../src/assets/images/blogimages');
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];

// 1. Get all markdown files in POSTS_DIR
const postFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

// 2. Collect all thumbnails and their posts
const thumbnailMap = {};
const postData = [];

for (const file of postFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  const thumbnail = data.thumbnail || null;
  postData.push({ file, filePath, data, content, thumbnail });
  if (thumbnail) {
    if (!thumbnailMap[thumbnail]) thumbnailMap[thumbnail] = [];
    thumbnailMap[thumbnail].push(filePath);
  }
}

// 3. Find duplicates
const duplicates = Object.entries(thumbnailMap).filter(([thumb, files]) => files.length > 1);
if (duplicates.length === 0) {
  console.log('No duplicate thumbnails found!');
  process.exit(0);
}
console.log('Duplicate thumbnails found:');
duplicates.forEach(([thumb, files]) => {
  console.log(`  ${thumb}:`);
  files.forEach(f => console.log(`    - ${f}`));
});

// 4. List all available images from blogimages folder
const allImages = fs.readdirSync(IMAGES_DIR)
  .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
  .map(f => '/assets/images/blogimages/' + f);

// 5. Find used images
const usedImages = new Set(postData.map(p => p.thumbnail).filter(Boolean));
const unusedImages = allImages.filter(img => !usedImages.has(img));

if (unusedImages.length === 0) {
  console.log('No unused images available to assign.');
  process.exit(1);
}

// 6. Assign unused images to posts with duplicate thumbnails (except the first occurrence)
let unusedIdx = 0;
let changes = [];
for (const [thumb, files] of duplicates) {
  // Keep the first post as-is, update the rest
  for (let i = 1; i < files.length; i++) {
    if (unusedIdx >= unusedImages.length) break;
    const filePath = files[i];
    const post = postData.find(p => p.filePath === filePath);
    if (!post) continue;
    const newThumb = unusedImages[unusedIdx++];
    // Update front matter
    const newData = { ...post.data, thumbnail: newThumb };
    const newContent = matter.stringify(post.content, newData);
    fs.writeFileSync(filePath, newContent, 'utf8');
    changes.push({ file: post.file, old: post.thumbnail, new: newThumb });
    console.log(`Assigned new thumbnail to ${post.file}: ${newThumb}`);
  }
}

if (changes.length === 0) {
  console.log('No changes made (not enough unused images).');
} else {
  console.log(`\nSummary of changes:`);
  changes.forEach(c => {
    console.log(`  ${c.file}: ${c.old} -> ${c.new}`);
  });
} 