const fs = require('fs')
const path = require('path')
const pages = require('./modules/pages')

pages.init()

fs.readdirSync(path.join('src', 'pages')).forEach(file => {
  try {
    const filePath = path.join('src', 'pages', file)
    if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.adoc')) {
      pages.convert(filePath)
    }
  } catch (e) {
    console.log('', e)
    throw e
  }
})


