const fs = require('fs')
const path = require('path')

const outDir = 'build/javascripts'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir)
}

let content = '';
fs.readdirSync(path.join('src', 'javascripts')).forEach(file => {
  try {
    let filePath = path.join('src', 'javascripts', file)
    if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.js')) {
      const input = fs.readFileSync(filePath, 'utf-8')
      content += `${input}\n`
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
})
fs.writeFileSync(`${outDir}/main.js`, content, 'utf-8')
console.log(`  updated ${outDir}/main.js`)
