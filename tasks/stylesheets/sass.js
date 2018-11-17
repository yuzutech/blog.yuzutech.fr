const fs = require('fs')
const path = require('path')
const sass = require('node-sass')

const dir = 'public/stylesheets'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

function generateAll () {
  const stylesheetsDir = path.join('src', 'stylesheets')
  fs.readdirSync(stylesheetsDir).forEach(file => {
    const filePath = path.join(stylesheetsDir, file)
    generate(filePath)
  })
}

function generate (sassFile) {
  if (fs.lstatSync(sassFile).isFile()) {
    try {
      const outFile = `${dir}/${path.basename(sassFile, '.scss')}.css`
      const sourceMap = `${dir}/${path.basename(sassFile, '.scss')}.css.map`
      const result = sass.renderSync({
        file: sassFile,
        data: fs.readFileSync(sassFile, 'utf-8'),
        outFile: outFile,
        includePaths: [
          'node_modules/bulma'
        ],
        outputStyle: 'compact',
        sourceMap: true
      })
      fs.writeFileSync(outFile, result.css)
      console.log(` sass ${sassFile}`)
      if (result.map) {
        fs.writeFileSync(sourceMap, result.map)
      }
      return outFile
    } catch (e) {
      console.log('', e)
      throw e
    }
  }
}

module.exports = generate
module.exports._generateAll = generateAll
