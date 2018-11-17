const fs = require('fs')
const path = require('path')

const dir = 'public/javascripts'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

fs.readdirSync(path.join('src', 'javascripts')).forEach(file => {
  try {
    let filePath = path.join('src', 'javascripts', file)
    if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.js')) {
      const input = fs.readFileSync(filePath, 'utf-8')
      const output = `public/javascripts/${path.basename(filePath)}`
      fs.writeFileSync(output, input, 'utf-8')
      console.log(`  copy ${filePath}`)
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
})
