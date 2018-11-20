const fs = require('fs')
const path = require('path')

function get (config) {
  const files = []
  fs.readdirSync(path.join('src', 'images')).forEach(file => {
    let filePath = path.join('src', 'images', file)
    files.push({
      base: `${config.outDirectory}/images`,
      path: `${config.outDirectory}/images/${path.basename(filePath)}`,
      contents: fs.readFileSync(filePath, 'binary'),
      encoding: 'binary'
    })
  })
  return files
}

module.exports = get
