const fs = require('fs')
const path = require('path')
const sass = require('node-sass')

function generateAll () {
  const stylesheetsDir = path.join('src', 'stylesheets')
  fs.readdirSync(stylesheetsDir).forEach(file => {
    const filePath = path.join(stylesheetsDir, file)
    generate(filePath)
  })
}

function generate (cssFile) {
  const dir = 'bundle/stylesheets'
  if (fs.lstatSync(cssFile).isFile() && cssFile.endsWith('.scss')) {
    try {
      const outFile = `${dir}/${path.basename(cssFile, '.scss')}.css`
      const sourceMap = `${dir}/${path.basename(cssFile, '.scss')}.css.map`
      const result = sass.renderSync({
        file: cssFile,
        data: fs.readFileSync(cssFile, 'utf-8'),
        outFile: outFile,
        includePaths: [
          'node_modules/bulma'
        ],
        outputStyle: 'compact',
        sourceMap: true
      })
      fs.writeFileSync(outFile, result.css)
      console.log(` compile sass ${cssFile}`)
      if (result.map) {
        fs.writeFileSync(sourceMap, result.map)
      }
      return outFile
    } catch (e) {
      console.log('', e)
      throw e
    }
  } else {
    fs.writeFileSync(`bundle/stylesheets/${path.basename(cssFile)}`, fs.readFileSync(cssFile, 'utf-8'), 'utf-8')
    console.log(` copy css ${cssFile}`)
  }
}

module.exports = generate
module.exports._generateAll = generateAll
