const fsExtra = require('../_fs')

function loadUI (config) {
  const uiDirectory = config.uiDirectory
  const outDirectory = config.outDirectory || 'public'
  // sync
  fsExtra.copySync(`${uiDirectory}/images`, `${outDirectory}/images`)
  fsExtra.copySync(`${uiDirectory}/javascripts`, `${outDirectory}/javascripts`)
  fsExtra.copySync(`${uiDirectory}/stylesheets`, `${outDirectory}/stylesheets`)
  fsExtra.copySync(`${uiDirectory}/favicon.ico`, `${outDirectory}/favicon.ico`)
}

module.exports = loadUI
