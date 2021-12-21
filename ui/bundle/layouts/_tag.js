function getTagUrl(uiModel, tag) {
  return `${uiModel.siteRootPath}/tag/${tag.toLowerCase().replace('.', '-')}/index.html`
}

function tagCloud (uiModel) {
  const tags = uiModel.page.attributes.tags.map(tag => tag.trim())
  return tags.map(tag => `<a href="${getTagUrl(uiModel, tag)}" class="tag is-medium">${tag}</a>`)
}

module.exports = {
  tagCloud: tagCloud,
  getTagUrl: getTagUrl
}
