function get (pages, tag) {
  const taggedPages = pages.filter(p => p.tags.includes(tag))
  const pagesHTML = taggedPages.map((page, index) => {
    const tagsHTML = page.tags.map(tag => `<a href="/tag/${tag.toLowerCase().replace('.', '-')}/" class="tag is-light has-icon">
<span class="icon">
  <i class="fas fa-tag"></i> ${tag}
</span>
</a>`)
    const imageHTML = page.image ? `<div class="card-image">
  <img src="../../images/${page.image}" alt="${page.doc.getTitle()} illustration">
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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Yuzu tech, l'informatique sans pépins</title>
  <link rel="stylesheet" href="../../stylesheets/main.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
 <section class="section is-small">
  <div class="container">
   <div class="tags cloud">
    <i class="fa fa-tags label"></i>
      <span class="tag is-medium">
      ${tag}
      <a href="/" class="delete is-small"></a>
    </span>
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
