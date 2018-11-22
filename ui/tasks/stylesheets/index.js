const sass = require('./sass')
const autoprefix = require('./autoprefix')
const cleancss = require('./cleancss')

function generate () {
  const cssFile = sass()
  autoprefix(cssFile)
  cleancss(cssFile)
  return cssFile
}

module.exports = generate
