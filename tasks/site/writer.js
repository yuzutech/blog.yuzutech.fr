const fs = require('fs')
const ospath = require('path')

function write (files) {
  for (let file of files) {
    if (file.base && !fs.existsSync(file.base)) {
      const paths = file.base.split(ospath.sep)
      let expandingPath = '';
      for (let path of paths) {
        expandingPath = ospath.join(expandingPath, path)
        if (!fs.existsSync(expandingPath)) {
          fs.mkdirSync(expandingPath)
        }
      }
    }
    fs.writeFileSync(file.path, file.contents, file.encoding || 'utf-8')
  }
}

module.exports = write
