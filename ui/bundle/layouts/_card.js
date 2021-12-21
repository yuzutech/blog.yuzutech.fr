const icon = require('@fortawesome/fontawesome-svg-core').icon
const faTag = require('@fortawesome/free-solid-svg-icons').faTag

const { getTagUrl: getTagUrl } = require('./_tag')
const { getShortRevisionDate: getShortRevisionDate } = require('./_date')

function getTags (page) {
  if (page.asciidoc && page.asciidoc.attributes && page.asciidoc.attributes['page-tags']) {
    return page.asciidoc.attributes['page-tags'].split(',').map(tag => tag.trim())
  }
  return []
}

module.exports = (uiModel) => {
  return uiModel.page.contents
    .sort((a1, a2) => new Date(a2.asciidoc.attributes['page-revdate']) - new Date(a1.asciidoc.attributes['page-revdate']))
    .map((page, index) => {
    const tagsHTML = getTags(page).map(tag => `<a href="${getTagUrl(uiModel, tag)}" class="tag is-light has-icon">
  <span class="icon">
    ${icon(faTag).html} ${tag}
  </span>
</a>`)
    const attributes = page.asciidoc.attributes
    const image = attributes['page-image']
    const title = attributes['doctitle']
    const description = attributes['description']
    const revisionDate = new Date(attributes['page-revdate'])
    const pageUrl = `${uiModel.siteRootPath}${page.pub.url}`
    const imageHTML = image ? `<div class="card-image">
  <a href="${pageUrl}" class="summary">
    <img src="${uiModel.uiRootPath}/images/${image}" alt="${title} illustration">
  </a>
</div>` : ''
    return `<div class="column${index === 0 ? ' is-full' : ' is-one-third'}">
  <div class="card article${index === 0 ? ' card-featured' : ''}">
    ${index < 7 ? imageHTML : ''}
    <div class="card-content">
      <a href="${pageUrl}" class="summary">
        <time datetime="${revisionDate}">${getShortRevisionDate(revisionDate)}</time>
        <h2 class="article-title">${title}</h2>
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
