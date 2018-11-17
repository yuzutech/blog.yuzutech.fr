const processor = require('./processor')
processor.init()
const indexPage = require('./index')
const tagPages = require('./tags')

const pages = indexPage._getPages(processor)
indexPage(pages)
tagPages(pages)
