module.exports = (pages, siteRelativeRoot) => {
  return pages.map((page, index) => {
    const tagsHTML = page.tags.map(tag => `<a href="/tag/${tag.toLowerCase().replace('.', '-')}/" class="tag is-light has-icon">
  <span class="icon">
    <i class="fas fa-tag"></i> ${tag}
  </span>
</a>`)
    const imageHTML = page.image ? `<div class="card-image">
  <a href="/${page.href}" class="summary">
    <img src="${siteRelativeRoot}/images/${page.image}" alt="${page.doc.getTitle()} illustration">
  </a>
</div>` : ''
    return `<div class="column${index === 0 ? ' is-full' : ' is-one-third'}">
  <div class="card article${index === 0 ? ' card-featured' : ''}">
    ${imageHTML}
    <div class="card-content">
      <a href="/${page.href}" class="summary">
        <time datetime="${page.revisionDate}">${page.revisionDateShortFormat}</time>
        <h2 class="article-title">${page.doc.getTitle()}</h2>
        <p class="excerpt">${page.description}</p>
      </a>
      <p class="tags is-condensed">
        ${tagsHTML.join('\n')}
      </p>
    </div>
  </div>
</div>`})
}
