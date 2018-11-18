const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const browserSync = require("browser-sync")

browserSync({server: "./public"});

const processor = require('./pages/processor')
processor.init()
const indexPage = require('./pages/index')
const tagPages = require('./pages/tags')
const stylesheetsGenerator = require('./stylesheets/index')

const watcher = chokidar.watch(['src/pages/**.adoc', 'src/stylesheets/**.scss', 'src/stylesheets/**.css', 'src/images/**', 'src/javascripts/**', 'src/templates/**.js'], {
  persistent: true
})

function buildStylesheet(filePath) {
  const dir = 'public/stylesheets'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  if (filePath.endsWith('.scss')) {
    try {
      const cssFile = stylesheetsGenerator(filePath)
      browserSync.reload(cssFile)
    } catch (e) {
      console.error(`Unable to compile ${path.basename(filePath)}, skipping.`, e);
    }
  } else {
    fs.writeFileSync(`public/stylesheets/${path.basename(filePath)}`, fs.readFileSync(filePath, 'utf-8'), 'utf-8')
    browserSync.reload(`stylesheets/${path.basename(filePath)}`)
  }
}

function buildPages(filePath) {
  processor.convert(filePath)
  const pages = indexPage._getPages(processor)
  indexPage(pages)
  tagPages(pages)
  browserSync.reload(`${path.basename(filePath)}`)
  browserSync.reload('index.html')
}

function buildImages(filePath) {
  const dir = 'public/images'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
    fs.writeFileSync(`public/images/${path.basename(filePath)}`, fs.readFileSync(filePath, 'binary'), 'binary')
  } else if (filePath.endsWith('.ico')) {
    fs.writeFileSync(`public/${path.basename(filePath)}`, fs.readFileSync(filePath, 'binary'), 'binary')
  }
  browserSync.reload()
}

function buildJavaScripts() {
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
  browserSync.reload(`javascripts/main.js`)
}

function buildTemplates() {
  // purge cache
  delete require.cache[require.resolve('../src/templates/index-page')]
  delete require.cache[require.resolve('../src/templates/tag-page')]
  const pages = indexPage._getPages(processor)
  indexPage(pages)
  tagPages(pages)
  browserSync.reload('index.html')
}

function update (filePath) {
  if (filePath.includes('stylesheets')) {
    buildStylesheet(filePath)
  } else if (filePath.includes('pages')) {
    buildPages(filePath)
  } else if (filePath.includes('images')) {
    buildImages(filePath)
  } else if (filePath.includes('javascripts')) {
    buildJavaScripts()
  } else if (filePath.includes('templates')) {
    buildTemplates()
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
