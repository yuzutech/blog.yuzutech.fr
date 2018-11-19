const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const stylesheetsGenerator = require('./stylesheets/index')

const baseOutDir = 'build'

const watcher = chokidar.watch(['src/stylesheets/**.scss', 'src/stylesheets/**.css', 'src/images/**', 'src/javascripts/**', 'src/templates/**/**.js'], {
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

function processImages(filePath) {
  const outDir = `${baseOutDir}/images`
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }
  const basename = path.basename(filePath)
  if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
    fs.writeFileSync(`${outDir}/${basename}`, fs.readFileSync(filePath, 'binary'), 'binary')
  } else if (filePath.endsWith('.ico')) {
    fs.writeFileSync(`${baseOutDir}/${basename}`, fs.readFileSync(filePath, 'binary'), 'binary')
  }
}

function processJavaScripts() {
  const outDir = `${baseOutDir}/javascripts`
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
    fs.writeFileSync(`${outDir}/main.js`, content, 'utf-8')
    console.log(`  update ${outDir}/main.js`)
  })
}

function processTemplates(filePath) {
  const outDir = `${baseOutDir}/templates`
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
  }
  const basename = path.basename(filePath)
  fs.writeFileSync(`${outDir}/${basename}`,   fs.readFileSync(filePath, 'utf-8'), 'utf-8')
}

function update (filePath) {
  if (filePath.includes('stylesheets')) {
    processStylesheets(filePath)
  } else if (filePath.includes('images')) {
    processImages(filePath)
  } else if (filePath.includes('javascripts')) {
    processJavaScripts()
  } else if (filePath.includes('templates')) {
    processTemplates(filePath)
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
