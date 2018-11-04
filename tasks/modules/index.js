const fs = require('fs')
const path = require('path')

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


function generate (processor) {
  const pages = [];
  fs.readdirSync(path.join('src', 'pages')).forEach(file => {
    try {
      const filePath = path.join('src', 'pages', file)
      if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.adoc')) {
        const doc = processor.convert(filePath)
        const revisionDate = new Date(doc.getAttribute('revdate'))
        const description = doc.getAttribute('description')
        const tags = doc.getAttribute('page-tags') || ''
        const monthName = monthNames[revisionDate.getMonth()];
        pages.push({
          doc: doc,
          file: filePath,
          href: `${path.basename(filePath, '.adoc')}.html`,
          revisionDate: revisionDate,
          revisionDateShortFormat: `${monthName} ${revisionDate.getDate()}, ${revisionDate.getFullYear()}`,
          description: description,
          tags: tags.split(',').map(value => value.trim().replace('.', '-'))
        })
      }
    } catch (e) {
      console.log('', e)
      throw e
    }
  })

  const pagesHTML = pages.map(page => {
    const tagsHTML = page.tags.map(tag => `<a href="/tag/${tag.toLowerCase()}/" class="tag is-light has-icon">
<span class="icon">
  <i class="fas fa-tag"></i> ${tag}
</span>
</a>`)
    return `<div class="column">
<div class="card article">
  <div class="card-content">
  <a href="${page.href}" class="summary">
    <time datetime="${page.revisionDate}">${page.revisionDateShortFormat}</time>
    <h2 class="article-title">
    ${page.doc.getTitle()}
    </h2>
    <p class="excerpt">
    ${page.description}
    </p>
  </a>
  <p class="tags is-condensed">
    ${tagsHTML.join('\n')}
  </p>
  </div>
</div>`
  });
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Yuzu tech, l'informatique sans pépins</title>
  <link rel="stylesheet" href="./stylesheets/main.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
 <section class="section">
    <div class="container">
      <div class="columns is-desktop is-multiline">
        ${pagesHTML.join('\n')}
      </div>
    </div>
  </section>
</body>`
  fs.writeFileSync('public/index.html', page, 'utf-8')
}

module.exports = {
  generate: generate
}
