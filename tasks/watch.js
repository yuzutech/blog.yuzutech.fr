const fs = require('fs')
const fsExtra = require('./_fs')
const path = require('path')
const chokidar = require('chokidar')
const browserSync = require('browser-sync')
const processor = require('./pages/processor')
const catalog = require('./pages/catalog')

const uiDirectory = 'ui/build'

processor.init()
browserSync({server: './public'})

const watcher = chokidar.watch(['src/pages/**.adoc', 'src/images/**', `${uiDirectory}/**`], {
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
  const templates = require(path.join(process.cwd(), uiDirectory, 'templates/index'))
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
  } else if (filePath.includes(`${uiDirectory}/images`)) {
    fsExtra.copySync(`${uiDirectory}/images`, 'public/images')
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/javascripts`)) {
    fsExtra.copySync(`${uiDirectory}/javascripts`, 'public/javascripts')
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/stylesheets`)) {
    fsExtra.copySync(`${uiDirectory}/stylesheets`, 'public/stylesheets')
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/templates`)) {
    delete require.cache[require.resolve(path.join(process.cwd(), uiDirectory, 'templates/index'))] // remove cache
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
