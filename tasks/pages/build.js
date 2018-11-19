const fs = require('fs')
const processor = require('./processor')
const catalog = require('./catalog')

processor.init()

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

const pages = catalog.getCatalog()
const templates = require('../../ui/build/templates/index')
fs.writeFileSync(`public/index.html`, templates.convertMainPage(pages) , 'utf-8') // index.html
generateTagPages(pages, templates)
