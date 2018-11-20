const ospath = require('path')
const childProcess = require('child_process')

const rimraf = require('rimraf')
const uiLoader = require('./ui/loader')
const processor = require('./pages/processor')
const catalog = require('./pages/catalog')
const writer = require('./site/writer')
const assets = require('./assets/index')

const uiDirectory = 'ui/build'
const outDirectory = 'public'
const templateModule = ospath.join(process.cwd(), uiDirectory, 'templates/index')
const config = {uiDirectory, outDirectory, templateModule}

// clear public/*
rimraf.sync(`${outDirectory}/*`)

// build UI project
childProcess.execSync('npm run build', {cwd: ospath.resolve(process.cwd(), 'ui')})

// load UI
uiLoader(config)

const pages = catalog.getCatalog(config)
const templates = require(config.templateModule)

const files = []
files.push({
  path: 'public/index.html',
  contents: templates.convertMainPage(pages)
})
files.push.apply(files, processor.generateTagPages(pages, templates, config));
files.push.apply(files, pages)
files.push.apply(files, assets(config))

// Flush to disk!
writer(files)
