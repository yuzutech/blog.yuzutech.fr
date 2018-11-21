function getTags (contentCatalog) {
  const result = new Set()
  contentCatalog.getFiles().forEach((file) => {
    if (file.asciidoc) {
      const pageTags = file.asciidoc.attributes['page-tags']
      if (pageTags) {
        pageTags.split(',').map(tag => tag.trim()).forEach((tag) => {
          result.add(tag)
        })
      }
    }
  })
  return Array.from(result)
}

function getUrl(tag) {
  return `tag/${tag.toLowerCase().replace('.', '-')}/index.html`
}

module.exports = {
  getTags: getTags,
  getUrl: getUrl
}
