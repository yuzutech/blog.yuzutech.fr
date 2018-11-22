const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const generateStylesheet = require('./stylesheets/index')

const baseOutDir = 'bundle'

const watcher = chokidar.watch(['src/stylesheets/main.scss'], {
  persistent: true
})

function processStylesheet () {
  const outDir = `${baseOutDir}/stylesheets`
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }
  try {
    generateStylesheet()
  } catch (e) {
    console.error(`Unable to compile main.scss, skipping.`, e);
  }
}

function update (filePath) {
  if (filePath.includes('stylesheets')) {
    processStylesheet()
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
