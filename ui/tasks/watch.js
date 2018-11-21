const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const stylesheetsGenerator = require('./stylesheets/index')

const baseOutDir = 'bundle'

const watcher = chokidar.watch(['src/stylesheets/**.scss'], {
  persistent: true
})

function processStylesheets(filePath) {
  const outDir = `${baseOutDir}/stylesheets`
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }
  const basename = path.basename(filePath)
  if (filePath.endsWith('.scss')) {
    try {
      stylesheetsGenerator(filePath)
    } catch (e) {
      console.error(`Unable to compile ${basename}, skipping.`, e);
    }
  } else {
    fs.writeFileSync(`${outDir}/${basename}`, fs.readFileSync(filePath, 'utf-8'), 'utf-8')
  }
}

function update (filePath) {
  if (filePath.includes('stylesheets')) {
    processStylesheets(filePath)
  }
}

watcher
  .on('add', filePath => {
    console.log(`File ${filePath} has been added`)
    update(filePath)
  })
  .on('change', filePath => {
    console.log(`File ${filePath} has been changed`)
    update(filePath)
  });
