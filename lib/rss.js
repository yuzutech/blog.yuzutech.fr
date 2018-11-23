function categories (article) {
  if (article.asciidoc.attributes['page-tags']) {
    return article.asciidoc.attributes['page-tags']
      .split(',')
      .map(tag => tag.trim())
  }
  return [];
}

function atomItemModel (uiModel, article) {
  const attributes = article.asciidoc.attributes
  const revisionDate = new Date(attributes['revdate'])
  const image = attributes['page-image']
  return {
    title: article.asciidoc.doctitle,
    description: attributes['description'],
    creator: attributes['page-author'],
    categories: categories(article),
    pubDate: revisionDate.toUTCString(),
    image: image,
    contents: article.contents,
    path: article.out.path
  }
}

function generateAtomFeedModel (uiModel, articles) {
  const antoraVersion = '1.1.1'
  const buildDate = new Date().toUTCString()
  const atomItems = articles.map(article => atomItemModel(uiModel, article))
  return {
    title: uiModel.title,
    url: uiModel.url,
    description: 'Yuzu tech technical blog',
    favicon: `${uiModel.url}/favicon.ico`,
    link: `${uiModel.url}/rss/feed.xml`,
    ttl: 60,
    lastBuildDate: buildDate,
    generator: `Antora ${antoraVersion}`,
    items: atomItems
  }
}

module.exports.generateAtomFeedModel = generateAtomFeedModel
