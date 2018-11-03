const fs = require('fs')
const path = require('path')

const sass = require('node-sass')

const dir = 'public/stylesheets'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const stylesheetsDir = path.join('src', 'stylesheets')
fs.readdirSync(stylesheetsDir).forEach(file => {
  try {
    let filePath = path.join(stylesheetsDir, file)
    if (fs.lstatSync(filePath).isFile()) {
      const outFile = `${dir}/${path.basename(filePath, '.scss')}.css`
      const sourceMap = `${dir}/${path.basename(filePath, '.scss')}.css.map`
      const result = sass.renderSync({
        file: filePath,
        data: fs.readFileSync(filePath, 'utf-8'),
        outFile: outFile,
        includePaths: [
          'node_modules/bulma'
        ],
        outputStyle: 'compact',
        sourceMap: true
      })
      fs.writeFileSync(outFile, result.css)
      if (result.map) {
        fs.writeFileSync(sourceMap, result.map)
      }
      console.log(` create ${outFile}`)
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
})
