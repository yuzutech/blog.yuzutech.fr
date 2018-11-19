const sass = require('./sass')
const autoprefix = require('./autoprefix')
const cleancss = require('./cleancss')

function generateAll () {
  sass._generateAll()
  autoprefix._generateAll()
  cleancss._generateAll()
}

function generate (sassFile) {
  const cssFile = sass(sassFile)
  autoprefix(cssFile)
  cleancss(cssFile)
  return cssFile
}

module.exports = generate
module.exports._generateAll = generateAll
