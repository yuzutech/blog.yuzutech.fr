function tagHref(tag) {
  return `/tag/${tag.toLowerCase().replace('.', '-')}/`
}

function tagCloud (pages) {
  const tags = new Set()
  for (let page of pages) {
    for (let tag of page.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).map(tag => `<a href="${tagHref(tag)}" class="tag is-medium">${tag}</a>`)
}

function tagPost (page) {
  return page.tags.map(tag => `<a href="${tagHref(tag)}" class="tag is-light has-icon">
  <span class="icon">
    <i class="fas fa-tag"></i> ${tag}
  </span>
</a>`)
}

module.exports = {
  tagCloud: tagCloud,
  tagPost: tagPost,
}
