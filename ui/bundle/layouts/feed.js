function atomItem (uiModel, item) {
  const categories = item.categories.map(category => `<category><![CDATA[${category}]]></category>`)
  return `<item>
    <title><![CDATA[${item.title}]]></title>
    <description><![CDATA[${item.description}]]></description>
    <link>${item.canonicalUrl}</link>
    ${categories.join('\n')}
    <dc:creator><![CDATA[${item.creator}]]></dc:creator>
    <pubDate>${item.pubDate}</pubDate>
    <media:content url="${uiModel.site.url}${uiModel.site.ui.url}/images/${item.image}" medium="image"/>
    <content:encoded><![CDATA[${item.contents}]]></content:encoded>
  </item>`
}

function generateAtomFeed (uiModel, atomFeedModel) {
  const atomItems = atomFeedModel.items.map(item => atomItem(uiModel, item))
  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
    <channel>
      <title><![CDATA[${atomFeedModel.title}]]></title>
      <description><![CDATA[${atomFeedModel.description}]]></description>
      <link>${atomFeedModel.url}</link>
      <image>
        <url>${atomFeedModel.favicon}</url>
        <title>${atomFeedModel.title}</title>
        <link>${atomFeedModel.url}</link>
      </image>
      <generator>${atomFeedModel.generator}</generator>
      <lastBuildDate>${atomFeedModel.lastBuildDate}</lastBuildDate>
      <atom:link href="${atomFeedModel.link}" rel="self" type="application/rss+xml"/>
      <ttl>${atomFeedModel.ttl}</ttl>
      ${atomItems.join('\n')}
    </channel>
  </rss>`
}

function convert (uiModel) {
  const atomFeedModel = uiModel.page.contents
  return generateAtomFeed(uiModel, atomFeedModel)
}

module.exports = convert
