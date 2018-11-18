const fs = require('fs')
const path = require('path')

const dir = 'public/javascripts'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

let content = '';
fs.readdirSync(path.join('src', 'javascripts')).forEach(file => {
  try {
    let filePath = path.join('src', 'javascripts', file)
    if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.js')) {
      const input = fs.readFileSync(filePath, 'utf-8')
      content += `${input}\n`
      const output = `public/javascripts/${path.basename(filePath)}`
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
  fs.writeFileSync(`public/javascripts/main.js`, content, 'utf-8')
  console.log('  update public/javascripts/main.js')
})
