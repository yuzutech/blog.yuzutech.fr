const fs = require('fs')
const path = require('path')

const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const dir = 'build/stylesheets'

function generateAll () {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    generate(filePath)
  })
}

function generate (cssFile) {
  if (fs.lstatSync(cssFile).isFile() && cssFile.endsWith('.css')) {
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
}

module.exports = generate
module.exports._generateAll = generateAll
