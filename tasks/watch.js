const fsExtra = require('./_fs')
const ospath = require('path')
const chokidar = require('chokidar')
const browserSync = require('browser-sync')
const catalog = require('./pages/catalog')
const processor = require('./pages/processor')
const writer = require('./site/writer')

const uiDirectory = 'ui/build'
const outDirectory = 'public'
const templateModule = ospath.join(process.cwd(), uiDirectory, 'templates/index')
const config = { uiDirectory, outDirectory, templateModule }

browserSync({ server: './public' })
const watcher = chokidar.watch(['src/pages/**.adoc', 'src/images/**', `${uiDirectory}/**`], {
  persistent: true
})

function processPages () {
  const pages = catalog.getCatalog(config)
  const templates = require(config.templateModule)
  const files = []
  files.push({
    path: 'public/index.html',
    contents: templates.convertMainPage(pages)
  })
  files.push.apply(files, processor.generateTagPages(pages, templates, config));
  files.push.apply(files, pages)
  writer(files) // Flush to disk!
  browserSync.reload()
}

function update (filePath) {
  if (filePath.includes('src/pages')) {
    processPages()
  } else if (filePath.includes('src/images')) {
    fsExtra.copySync(`src/images`, `${config.outDirectory}/images`)
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/images`)) {
    fsExtra.copySync(`${uiDirectory}/images`, `${config.outDirectory}/images`)
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/javascripts`)) {
    fsExtra.copySync(`${uiDirectory}/javascripts`, `${config.outDirectory}/javascripts`)
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/stylesheets`)) {
    fsExtra.copySync(`${uiDirectory}/stylesheets`, `${config.outDirectory}/stylesheets`)
    browserSync.reload()
  } else if (filePath.includes(`${uiDirectory}/templates`)) {
    delete require.cache[require.resolve(config.templateModule)] // remove cache
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
