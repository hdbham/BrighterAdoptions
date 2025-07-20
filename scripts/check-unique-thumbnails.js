const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../src/_posts');

const postFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const thumbnailMap = {};

for (const file of postFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  const thumbnail = data.thumbnail || null;
  if (thumbnail) {
    if (!thumbnailMap[thumbnail]) thumbnailMap[thumbnail] = [];
    thumbnailMap[thumbnail].push(file);
  }
}

const duplicates = Object.entries(thumbnailMap).filter(([thumb, files]) => files.length > 1);
if (duplicates.length === 0) {
  console.log('All blog posts have unique thumbnails!');
} else {
  console.log('Duplicate thumbnails found:');
  duplicates.forEach(([thumb, files]) => {
    console.log(`  ${thumb}:`);
    files.forEach(f => console.log(`    - ${f}`));
  });
} 