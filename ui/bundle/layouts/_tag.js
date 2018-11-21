function getTagUrl(tag) {
  return `./tag/${tag.toLowerCase().replace('.', '-')}/index.html`
}

function tagCloud (uiModel) {
  const tags = uiModel.page.attributes.tags.map(tag => tag.trim())
  return tags.map(tag => `<a href="${getTagUrl(tag)}" class="tag is-medium">${tag}</a>`)
}

function tagPost (page) {
  return page.attributes.tags.map(tag => `<a href="${getTagUrl(tag)}" class="tag is-light has-icon">
  <span class="icon">
    <i class="fas fa-tag"></i> ${tag}
  </span>
</a>`)
}

module.exports = {
  tagCloud: tagCloud,
  tagPost: tagPost,
  getTagUrl: getTagUrl
}
