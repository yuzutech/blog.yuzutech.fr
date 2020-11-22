const dom = require('@fortawesome/fontawesome-svg-core').dom
const ospath = require('path')
const { DateTime } = require('luxon')

module.exports = (title, uiModel) => {
  const page = uiModel.page
  const site = uiModel.site
  let openGraphMeta = ''
  if (page.layout === 'default') {
    const attributes = page.attributes
    const basename = ospath.basename(attributes.relative, '.adoc')
    if (basename !== 'index') {
      const revisionDate = attributes.revdate
      const revisionDateTime = DateTime.fromFormat(revisionDate, 'yyyy-MM-dd HH:mm')
      let twitterCreator = ''
      const twitter = attributes.twitter
      if (twitter) {
        twitterCreator = `<meta name="twitter:creator" content="${twitter}">
  <meta name="twitter:site" content="${twitter}">`
      }
      openGraphMeta = `<meta name="author" content="${attributes.author}">
<meta name="og:article:author" content="${attributes.author}">
<meta property="og:title" content="${page.title}">
<meta name="twitter:title" content="${page.title}">
<meta name="description" content="${page.description}">
<meta property="og:description" content="${page.description}">
<meta name="twitter:description" content="${page.description}">
<meta property="og:image" content="${site.url}${site.ui.url}/images/opengraph/${basename}.jpg">
<meta name="twitter:image" content="${site.url}${site.ui.url}/images/opengraph/${basename}.jpg">
<meta property="og:image:height" content="630">
<meta property="og:image:width" content="1200">
<meta property="og:type" content="article">
<meta property="article:published_time" content="${revisionDateTime.toISODate()}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:widgets:csp" content="on">
<meta name="twitter:data1" content="${revisionDateTime.setLocale('en').toLocaleString(DateTime.DATE_FULL)}">
<meta name="twitter:label1" content="Published on">
${twitterCreator}`
    }
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="canonical" href="${page.canonicalUrl}">
  <meta property="og:url" content="${page.canonicalUrl}">
  <meta property="og:site_name" content="${site.title}">
  <link rel="alternate" type="application/rss+xml" title="Feed for articles" href="/blog/rss/feed.xml">
  ${openGraphMeta}
  <link rel="stylesheet" href="${uiModel.uiRootPath}/stylesheets/main.min.css">
  <style>
    ${dom.css()}
  </style>
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-42107476-2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-42107476-2');
  </script>
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://www.yuzutech.fr">
        <img src="${uiModel.uiRootPath}/images/logo_100.png" alt="Yuzu tech">
      </a>
      <a role="button" class="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <a class="navbar-item" href="https://www.yuzutech.fr/#metier">
          Notre métier
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#offres">
          Nos offres
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#clients">
          Nos clients
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#contact">
          Contact
        </a>
        <a class="navbar-item" href="${uiModel.siteRootPath}/blog/">
          Blog
        </a>
      </div>
    </div>
  </nav>`
}
