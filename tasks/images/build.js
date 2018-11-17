const fs = require('fs')
const path = require('path')

const dir = 'public/images'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

fs.readdirSync(path.join('src', 'images')).forEach(file => {
  let filePath = path.join('src', 'images', file)
  let data = fs.readFileSync(filePath, 'binary')
  let basename = path.basename(filePath)
  if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
    fs.writeFileSync(`public/images/${basename}`, data, 'binary')
  } else if (filePath.endsWith('.ico')) {
    fs.writeFileSync(`public/${basename}`, data, 'binary')
  }
})
