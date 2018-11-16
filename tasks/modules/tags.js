const fs = require('fs')
const path = require('path')

function generate (pages) {
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
    console.log(`  Create tag page ${tagDir}`)
    delete require.cache[require.resolve('../../src/templates/tag-page')]
    const templateTagPage = require('../../src/templates/tag-page')
    const page = templateTagPage.get(pages, tag)
    fs.writeFileSync(`public/tag/${tagDir}/index.html`, page, 'utf-8')
  }
}

module.exports = {
  generate: generate
}
