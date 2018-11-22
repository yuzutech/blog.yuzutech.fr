const fs = require('fs')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

function generate (cssFile) {
  try {
    const input = fs.readFileSync(cssFile, 'utf-8')
    postcss([autoprefixer])
      .process(input, { from: cssFile, to: cssFile })
      .then(result => {
        fs.writeFileSync(cssFile, result.css)
        console.log(`  autoprefix ${cssFile}`)
      })
  } catch (e) {
    console.log('', e)
    throw e
  }
}

module.exports = generate
