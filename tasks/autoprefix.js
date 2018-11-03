const fs = require('fs')
const path = require('path')

const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const dir = 'public/stylesheets'
fs.readdirSync(dir).forEach(file => {
  try {
    let filePath = path.join(dir, file)
    if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.css'))  {
      const input = fs.readFileSync(filePath, 'utf-8')
      postcss([autoprefixer])
        .process(input, { from: filePath, to: filePath})
        .then(result => {
          fs.writeFileSync(filePath, result.css)
          console.log(`  autoprefix ${filePath}`)
        })
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
})
