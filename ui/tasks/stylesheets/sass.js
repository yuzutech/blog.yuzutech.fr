const fs = require('fs')
const sass = require('node-sass')

const dir = 'bundle/stylesheets'

function generate () {
  try {
    const outFile = `${dir}/main.css`
    const sourceMap = `${dir}/main.css.map`
    const file = 'src/stylesheets/main.scss'
    const result = sass.renderSync({
      file,
      data: fs.readFileSync(file, 'utf-8'),
      outFile: outFile,
      includePaths: [
        'node_modules/bulma'
      ],
      outputStyle: 'compact',
      sourceMap: true
    })
    fs.writeFileSync(outFile, result.css)
    console.log(` compile sass ${file}`)
    if (result.map) {
      fs.writeFileSync(sourceMap, result.map)
    }
    return outFile
  } catch (e) {
    console.log('', e)
    throw e
  }
}

module.exports = generate
