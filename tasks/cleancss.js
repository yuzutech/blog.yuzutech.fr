const fs = require('fs')
const path = require('path')

const CleanCSS = require('clean-css')
const cleanCSS = new CleanCSS({})

const dir = 'public/stylesheets'
fs.readdirSync(dir).forEach(file => {
  try {
    let filePath = path.join(dir, file)
    if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.css')) {
      const input = fs.readFileSync(filePath, 'utf-8')
      const result = cleanCSS.minify(input)
      const output = `${dir}/${path.basename(filePath, '.css')}.min.css`
      fs.writeFileSync(output, result.styles, 'utf-8')
      console.log(`  cleancss ${filePath}`)
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
})
