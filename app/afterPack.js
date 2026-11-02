// Runs during "npm run build": stamps your icon, name and copyright onto the Windows .exe.
// (electron-builder normally does this itself, but that needs administrator rights on some PCs.)
const path = require('path');

exports.default = async function (context) {
  if (context.electronPlatformName !== 'win32') return;
  const rcedit = require('rcedit');
  const info = context.packager.appInfo;
  const exe = path.join(context.appOutDir, info.productFilename + '.exe');
  const icon = path.join(context.packager.projectDir, 'build', 'icon.ico');
  await rcedit(exe, {
    icon,
    'version-string': {
      CompanyName: 'Eric',
      FileDescription: info.productName,
      ProductName: info.productName,
      LegalCopyright: 'Copyright © Eric',
      OriginalFilename: info.productFilename + '.exe',
      InternalName: info.productName
    }
  });
  console.log('  • icon and name stamped on ' + path.basename(exe));
};
