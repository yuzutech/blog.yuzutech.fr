const fs = require('fs')
const path = require('path')

const outDir = 'build/images'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir)
}

fs.readdirSync(path.join('src', 'images')).forEach(file => {
  let filePath = path.join('src', 'images', file)
  let data = fs.readFileSync(filePath, 'binary')
  let basename = path.basename(filePath)
  if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
    fs.writeFileSync(`${outDir}/${basename}`, data, 'binary')
  } else if (filePath.endsWith('.ico')) {
    fs.writeFileSync(`build/${basename}`, data, 'binary')
  }
})
