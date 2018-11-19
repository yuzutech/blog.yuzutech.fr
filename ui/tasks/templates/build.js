const fs = require('fs')
const path = require('path')

const outDir = 'build/templates'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir)
}

fs.readdirSync(path.join('src', 'templates')).forEach(file => {
  let filePath = path.join('src', 'templates', file)
  const basename = path.basename(filePath)
  fs.writeFileSync(`${outDir}/${basename}`, fs.readFileSync(filePath, 'utf-8'), 'utf-8')
})
