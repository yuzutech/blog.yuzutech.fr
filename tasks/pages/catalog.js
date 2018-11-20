const fs = require('fs')
const path = require('path')
const processor = require('./processor')

const monthNames = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
}

function getCatalog (config) {
  const pages = []
  const converter = processor.createConverter(config)
  fs.readdirSync(path.join('src', 'pages')).forEach(file => {
    try {
      const filePath = path.join('src', 'pages', file)
      if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.adoc')) {
        const doc = processor.load(filePath, converter)
        const revisionDate = new Date(doc.getAttribute('revdate'))
        const description = doc.getAttribute('description')
        const tags = doc.getAttribute('page-tags') || ''
        const monthName = monthNames[revisionDate.getMonth()]
        const href = `${path.basename(filePath, '.adoc')}.html`
        pages.push({
          doc: doc,
          file: filePath,
          path: `${config.outDirectory}/${href}`,
          contents: doc.convert(),
          href: href,
          revisionDate: revisionDate,
          revisionDateShortFormat: `${monthName} ${revisionDate.getDate()}, ${revisionDate.getFullYear()}`,
          description: description,
          tags: tags.split(',').map(value => value.trim()),
          image: doc.getAttribute('page-image'),
          featured: doc.hasAttribute('page-featured')
        })
      }
    } catch (e) {
      console.log('', e)
      throw e
    }
  })
  return pages.sort(function (p1, p2) {
    return p2.revisionDate - p1.revisionDate;
  });
}

module.exports.getCatalog = getCatalog
