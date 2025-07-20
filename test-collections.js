const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, 'src/_posts');

// Get all markdown files
const postFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

console.log('Total posts found:', postFiles.length);
console.log('\nAll posts with their tags:');

postFiles.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    const tags = data.tags || [];
    const hasFeatured = tags.includes('featured');
    const hasHidden = tags.includes('hidden');
    
    console.log(`- ${file}:`);
    console.log(`  Tags: ${tags.join(', ')}`);
    console.log(`  Has featured: ${hasFeatured}`);
    console.log(`  Has hidden: ${hasHidden}`);
    console.log(`  Would be included: ${hasFeatured && !hasHidden}`);
    console.log('');
});

// Filter for featured posts (same logic as in eleventy.current.js)
const featuredPosts = postFiles.filter(file => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    // Only include posts with the "featured" tag
    const hasFeaturedTag = data.tags && data.tags.includes('featured');
    
    // Exclude hidden posts
    const isHidden = data.tags && data.tags.includes('hidden');
    
    return hasFeaturedTag && !isHidden;
});

console.log('\n=== FINAL RESULTS ===');
console.log('Featured posts found:', featuredPosts.length);
console.log('Featured posts:');
featuredPosts.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    console.log(`- ${file}: ${data.title}`);
}); 