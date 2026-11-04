const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'dist');
if (fs.existsSync(target)) {
  if (fs.lstatSync(target).isSymbolicLink() || fs.realpathSync(target).toLowerCase() !== target.toLowerCase() || path.dirname(target) !== root) {
    throw new Error('Refusing to clean an unexpected dist path');
  }
  fs.rmSync(target, { recursive: true, force: true });
}
