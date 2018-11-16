function get (pages) {
  const pagesHTML = pages.map((page, index) => {
    const tagsHTML = page.tags.map(tag => `<a href="/tag/${tag.toLowerCase().replace('.', '-')}/" class="tag is-light has-icon">
<span class="icon">
  <i class="fas fa-tag"></i> ${tag}
</span>
</a>`)
    const imageHTML = page.image ? `<div class="card-image">
  <a href="${page.href}" class="summary">
    <img src="./images/${page.image}" alt="${page.doc.getTitle()} illustration">
  </a>
</div>` : ''
    return `<div class="column${index === 0 ? ' is-full' : ' is-one-third'}">
<div class="card article${index === 0 ? ' card-featured' : ''}">
  ${imageHTML}
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
</div>
</div>`
  })
  const tags = new Set()
  for (let page of pages) {
    for (let tag of page.tags) {
      tags.add(tag)
    }
  }
  const tagsHTML = Array.from(tags).map(tag => `<a href="/tag/${tag.toLowerCase().replace('.', '-')}/" class="tag is-medium">${tag}</a>`)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>hello</title>
  <link rel="stylesheet" href="./stylesheets/main.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
 <section class="section is-small">
  <div class="container">
   <div class="tags cloud">
    <i class="fa fa-tags label"></i>
    ${tagsHTML.join('\n')}
   </div>
  </div>
 </section>
 <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        ${pagesHTML.join('\n')}
      </div>
    </div>
  </section>
</body>`
}

module.exports = {
  get: get
}
