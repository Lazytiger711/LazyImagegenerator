const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const strRegex = /"([^"]{1000,})"|'([^']{1000,})'/g;
let match;
const sizes = [];
while ((match = strRegex.exec(html)) !== null) {
    const str = match[1] || match[2];
    sizes.push({ len: str.length, summary: str.substring(0, 100) });
}
sizes.sort((a, b) => b.len - a.len);
console.log(sizes.slice(0, 10));
