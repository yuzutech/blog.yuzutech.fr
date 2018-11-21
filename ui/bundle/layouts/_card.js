const { getTagUrl: getTagUrl } = require('./_tag')
const { getShortRevisionDate: getShortRevisionDate } = require('./_date')

function getTags (page) {
  if (page.asciidoc && page.asciidoc.attributes && page.asciidoc.attributes.tags) {
    return page.asciidoc.attributes.tags.split(',').map(tag => tag.trim())
  }
  return []
}

module.exports = (uiModel) => {
  return uiModel.page.contents.map((page, index) => {
    const tagsHTML = getTags(page).map(tag => `<a href="${getTagUrl(tag)}" class="tag is-light has-icon">
  <span class="icon">
    <i class="fas fa-tag"></i> ${tag}
  </span>
</a>`)
    const attributes = page.asciidoc.attributes
    const image = attributes['page-image']
    const doctitle = attributes['doctitle']
    const description = attributes['description']
    const revisionDate = new Date(attributes['page-revdate'])
    const imagesdir = attributes.imagesdir
    const imageHTML = image ? `<div class="card-image">
  <a href="${page.out.rootPath}/${page.out.path}" class="summary">
    <img src="${uiModel.uiRootPath}/images/${image}" alt="${doctitle} illustration">
  </a>
</div>` : ''
    return `<div class="column${index === 0 ? ' is-full' : ' is-one-third'}">
  <div class="card article${index === 0 ? ' card-featured' : ''}">
    ${imageHTML}
    <div class="card-content">
      <a href="${page.out.rootPath}/${page.out.path}" class="summary">
        <time datetime="${revisionDate}">${getShortRevisionDate(revisionDate)}</time>
        <h2 class="article-title">${doctitle}</h2>
        <p class="excerpt">${description}</p>
      </a>
      <p class="tags is-condensed">
        ${tagsHTML.join('\n')}
      </p>
    </div>
  </div>
</div>`
  })
}
