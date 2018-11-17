const fs = require('fs')
const path = require('path')

const CleanCSS = require('clean-css')
const cleanCSS = new CleanCSS({})

const dir = 'public/stylesheets'

function generateAll () {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    generate(filePath)
  })
}

function generate (cssFile) {
  try {
    if (fs.lstatSync(cssFile).isFile() && cssFile.endsWith('.css')) {
      const input = fs.readFileSync(cssFile, 'utf-8')
      const result = cleanCSS.minify(input)
      const output = `${dir}/${path.basename(cssFile, '.css')}.min.css`
      fs.writeFileSync(output, result.styles, 'utf-8')
      console.log(`  cleancss ${cssFile}`)
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
}

module.exports = generate
module.exports._generateAll = generateAll
