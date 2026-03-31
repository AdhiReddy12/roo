const fs = require('fs');
const path = require('path');

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changed = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let newContent = content.replace(emojiRegex, match => {
        if (match === '👤') return match; // Keep profile emoji
        return '';
    });
    if (newContent !== content) {
        fs.writeFileSync(f, newContent, 'utf8');
        changed++;
        console.log(`Updated ${f}`);
    }
});
console.log(`Finished, updated ${changed} files.`);
