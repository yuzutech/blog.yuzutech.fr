'use strict'

/**
 * Blog Generator based on Antora
 */
const ospath = require('path')
const aggregateContent = require('@antora/content-aggregator')
const buildNavigation = require('@antora/navigation-builder')
const buildPlaybook = require('@antora/playbook-builder')
const classifyContent = require('@antora/content-classifier')
const convertDocuments = require('@antora/document-converter')
const publishSite = require('@antora/site-publisher')
const mapSite = require('@antora/site-mapper')
const produceRedirects = require('@antora/redirect-producer')

const createConverter = require('./create-converter')
const { resolveConfig: resolveAsciiDocConfig } = require('@antora/asciidoc-loader')
const createPageComposer = require('../packages/fn-page-composer/lib/index')
const { buildSiteUiModel } = require('@antora/page-composer/lib/build-ui-model.js')
const loadUi = require('@antora/ui-loader')
const { getTags: getTags, getUrl: getTagUrl } = require('./tags')
const rss = require('./rss')
const opengraph = require('./opengraph')

async function generateSite (args, env) {
  const playbook = buildPlaybook(args, env)
  const asciidocConfig = resolveAsciiDocConfig(playbook)
  asciidocConfig.converter = createConverter
  const [contentCatalog, uiCatalog] = await Promise.all([
    aggregateContent(playbook).then((contentAggregate) => classifyContent(playbook, contentAggregate, asciidocConfig)),
    loadUi(playbook),
  ])
  const pages = convertDocuments(contentCatalog, asciidocConfig)
  const navigationCatalog = buildNavigation(contentCatalog, asciidocConfig)
  await opengraph.generate(contentCatalog.getPages().filter(page => page.asciidoc && page.src.basename !== 'index.adoc'))
  const rssItems = contentCatalog.getPages().filter(page => page.asciidoc && page.src.basename !== 'index.adoc')
  const uiModel = buildSiteUiModel(playbook, contentCatalog)
  const atomFeedModel = rss.generateAtomFeedModel(uiModel, rssItems)
  const composePage = createPageComposer(playbook, contentCatalog, uiCatalog, env, (file) => {
    return require(ospath.join(process.cwd(), playbook.ui.bundle.url, file.path))
  })
  pages.forEach((page) => composePage(page, contentCatalog, navigationCatalog))
  const siteFiles = mapSite(playbook, pages).concat(produceRedirects(playbook, contentCatalog))
  if (playbook.site.url) siteFiles.push(composePage(create404Page()))
  const tags = getTags(contentCatalog)
  const articles = contentCatalog.getFiles().filter(file => file.asciidoc && file.src.basename !== 'index.adoc')
  siteFiles.push(composePage(createRSSPage(atomFeedModel, articles), contentCatalog, navigationCatalog))
  tags.forEach((tag) => {
    const articlesWithTag = articles.filter(file => {
      if (file.asciidoc && file.asciidoc.attributes && file.asciidoc.attributes['page-tags']) {
        return file.asciidoc.attributes['page-tags'].split(',').map(tag => tag.trim()).includes(tag)
      }
      return false;
    })
    siteFiles.push(composePage(createTagPage(tag, articlesWithTag), contentCatalog, navigationCatalog))
  })
  siteFiles.push(composePage(createIndexPage(tags, articles), contentCatalog, navigationCatalog))
  const siteCatalog = { getFiles: () => siteFiles }
  return publishSite(playbook, [contentCatalog, uiCatalog, siteCatalog])
}


function createRSSPage (atomFeedModel, articles) {
  atomFeedModel.items = atomFeedModel.items.map(item => {
    // noinspection JSPrimitiveTypeWrapperUsage, JSUndefinedPropertyAssignment
    item.canonicalUrl = articles.filter(article => article.out.path === item.path)[0].pub.canonicalUrl
    return item
  })
  return {
    title: `Blog / RSS - Yuzu tech`,
    version: 'master',
    mediaType: 'application/rss+xml',
    contents: atomFeedModel,
    asciidoc: {
      attributes: {
        'page-layout': 'feed',
      }
    },
    src: {
      module: 'ROOT',
      component: 'blog',
      version: 'master',
    },
    out: { path: `blog/rss/feed.xml` },
    pub: {
      url: `/blog/rss/feed.xml`,
      moduleRootPath: '.',
      rootPath: '../../..'
    }
  }
}

function create404Page () {
  return {
    title: 'Page Not Found',
    mediaType: 'text/html',
    src: { stem: '404' },
    out: { path: '404.html' },
    pub: { url: '/404.html', rootPath: '' }
  }
}

function createTagPage (tag, files) {
  return {
    title: `Blog / ${tag} - Yuzu tech`,
    version: 'master',
    mediaType: 'text/html',
    contents: files,
    asciidoc: {
      attributes: {
        'page-layout': 'tag',
        'page-tag': tag
      }
    },
    src: {
      module: 'ROOT',
      component: 'blog',
      version: 'master',
    },
    out: { path: `blog/${getTagUrl(tag)}` },
    pub: {
      url: `/blog/${getTagUrl(tag)}`,
      moduleRootPath: '.',
      rootPath: '../../..'
    },
  }
}

function createIndexPage (tags, files) {
  return {
    title: 'Blog - Yuzu tech',
    version: 'master',
    mediaType: 'text/html',
    contents: files,
    asciidoc: {
      attributes: {
        'page-layout': 'index',
        'page-tags': tags
      }
    },
    src: {
      module: 'ROOT',
      component: 'blog',
      version: 'master',
    },
    out: { path: 'blog/index.html' },
    pub: {
      url: '/blog/index.html',
      moduleRootPath: '.',
      rootPath: '..'
    },
  }
}

module.exports = generateSite
