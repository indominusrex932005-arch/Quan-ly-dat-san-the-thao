import fs from 'node:fs';
import path from 'node:path';
import ejs from 'ejs';

function check(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) check(filename);
    else if (filename.endsWith('.ejs')) ejs.compile(fs.readFileSync(filename, 'utf8'), { filename });
  }
}
check('views');
console.log('EJS templates compile successfully.');
