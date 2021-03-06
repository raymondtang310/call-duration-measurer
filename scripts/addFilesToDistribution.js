const fs = require('fs');
const path = require('path');

function main() {
  const rootPath = path.resolve(__dirname, '..');
  const distPath = path.resolve(__dirname, '..', 'dist');

  // Create a copy of package.json that allows publishing in the distribution folder
  const packageJsonContent = fs.readFileSync(path.resolve(rootPath, 'package.json')).toString('utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  delete packageJson.private;
  fs.writeFileSync(path.resolve(distPath, 'package.json'), Buffer.from(JSON.stringify(packageJson, null, 2), 'utf-8'));

  // Copy files that would normally be included in an npm package to the distribution folder
  fs.copyFileSync(path.resolve(rootPath, 'CHANGELOG.md'), path.resolve(distPath, 'CHANGELOG.md'));
  fs.copyFileSync(path.resolve(rootPath, 'LICENSE'), path.resolve(distPath, 'LICENSE'));
  fs.copyFileSync(path.resolve(rootPath, 'README.md'), path.resolve(distPath, 'README.md'));
}

main();
