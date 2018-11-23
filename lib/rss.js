function atomCategories(article) {
  if (article.asciidoc.attributes['page-tags']) {
    return article.asciidoc.attributes['page-tags']
      .split(',')
      .map(tag => tag.trim())
      .map(tag => `<category><![CDATA[${tag}]]></category>`)
  }
  return [];
}

function atomItem (uiModel, article) {
  const attributes = article.asciidoc.attributes
  const revisionDate = new Date(attributes['revdate'])
  const image = attributes['page-image']
  return `<item>
    <title><![CDATA[${article.asciidoc.doctitle}]]></title>
    <description><![CDATA[${attributes['description']}]]></description>
    <link>${article.pub.canonicalUrl}</link>
    ${atomCategories(article).join('\n')}
    <dc:creator><![CDATA[${attributes['page-author']}]]></dc:creator>
    <pubDate>${revisionDate.toUTCString()}</pubDate>
    <media:content url="${uiModel.uiRootPath}/images/${image}" medium="image"/>
    <content:encoded><![CDATA[${article.contents}]]></content:encoded>
  </item>`
}

function generateAtomFeed (uiModel, articles) {
  const antoraVersion = '1.1.1'
  const buildDate = new Date().toUTCString()
  const ttl = 60
  const atomItems = articles.map(article => atomItem(uiModel, article))
  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
    <channel>
      <title><![CDATA[${uiModel.title}]]></title>
      <description>Yuzu tech technical blog</description>
      <link>${uiModel.url}</link>
      <image>
        <url>${uiModel.url}/favicon.png</url>
        <title>${uiModel.title}</title>
        <link>${uiModel.url}</link>
      </image>
      <generator>Antora ${antoraVersion}</generator>
      <lastBuildDate>${buildDate}</lastBuildDate>
      <atom:link href="${uiModel.url}/rss/feed.xml" rel="self" type="application/rss+xml"/>
      <ttl>${ttl}</ttl>
      ${atomItems.join('\n')}
    </channel>
  </rss>`
}

module.exports.generateAtomFeed = generateAtomFeed
