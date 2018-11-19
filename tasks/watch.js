const fs = require('fs')
const fsExtra = require('./_fs')
const path = require('path')
const chokidar = require('chokidar')
const browserSync = require("browser-sync")
const processor = require('./pages/processor')
const catalog = require('./pages/catalog')

processor.init()
browserSync({server: "./public"})

const watcher = chokidar.watch(['src/pages/**.adoc', 'src/images/**', 'ui/build/**'], {
  persistent: true
})

function generateTagPages (pages, templates) {
  const tags = new Set()
  for (let page of pages) {
    for (let tag of page.tags) {
      tags.add(tag)
    }
  }
  const dir = 'public/tag'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  for (let tag of tags) {
    const tagDir = tag.toLowerCase().replace('.', '-')
    const dir = `public/tag/${tagDir}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    const page = templates.convertTagPage(pages, tag)
    fs.writeFileSync(`public/tag/${tagDir}/index.html`, page, 'utf-8')
  }
}

function processPages() {
  const pages = catalog.getCatalog()
  const templates = require('../ui/build/templates/index')
  fs.writeFileSync(`public/index.html`, templates.convertMainPage(pages) , 'utf-8') // index.html
  generateTagPages(pages, templates)
  browserSync.reload()
}

function copyImages(filePath) {
  const dir = 'public/images'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
    fs.writeFileSync(`public/images/${path.basename(filePath)}`, fs.readFileSync(filePath, 'binary'), 'binary')
  }
  browserSync.reload()
}

function update (filePath) {
  if (filePath.includes('src/pages')) {
    processPages()
  } else if (filePath.includes('src/images')) {
    copyImages(filePath)
  } else if (filePath.includes('ui/build/images')) {
    fsExtra.copySync('ui/build/images', 'public/images')
    browserSync.reload()
  } else if (filePath.includes('ui/build/javascripts')) {
    fsExtra.copySync('ui/build/javascripts', 'public/javascripts')
    browserSync.reload()
  } else if (filePath.includes('ui/build/stylesheets')) {
    fsExtra.copySync('ui/build/stylesheets', 'public/stylesheets')
    browserSync.reload()
  } else if (filePath.includes('ui/build/templates')) {
    delete require.cache[require.resolve('../ui/build/templates/index')] // remove cache
    processPages()
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
