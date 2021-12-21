const { buildSiteUiModel, buildBaseUiModel, buildUiModel } = require('@antora/page-composer/lib/build-ui-model')
const createPageComposer = require('@antora/page-composer')
const opengraph = require('./opengraph')
const rss = require('./rss')
const { getUrl: getTagUrl, getTags } = require('./tags')

const ospath = require('path')

function createRSSPage (atomFeedModel, articles) {
  atomFeedModel.items = atomFeedModel.items.map(item => {
    // noinspection JSPrimitiveTypeWrapperUsage, JSUndefinedPropertyAssignment
    item.canonicalUrl = articles.filter(article => article.out.path === item.path)[0].pub.canonicalUrl
    return item
  })
  return {
    title: `Blog / RSS - Yuzu tech`,
    version: '',
    mediaType: 'application/rss+xml',
    contents: atomFeedModel,
    asciidoc: {
      attributes: {
        'page-layout': 'feed',
      }
    },
    src: {
      module: 'ROOT',
      component: 'ROOT',
      version: '',
    },
    out: { path: `rss/feed.xml` },
    pub: {
      url: `/rss/feed.xml`,
      moduleRootPath: '.',
      rootPath: '../..'
    }
  }
}


function createTagPage (tag, files) {
  return {
    title: `Blog / ${tag} - Yuzu tech`,
    version: '',
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
      component: 'ROOT',
      version: '',
    },
    out: { path: `${getTagUrl(tag)}` },
    pub: {
      url: `/${getTagUrl(tag)}`,
      moduleRootPath: '.',
      rootPath: '../..'
    },
  }
}

function createIndexPage (tags, files) {
  return {
    title: 'Blog - Yuzu tech',
    version: '',
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
      component: 'ROOT',
      version: '',
    },
    out: { path: 'index.html' },
    pub: {
      url: '/index.html',
      moduleRootPath: '.',
      rootPath: '.'
    },
  }
}


function createPageComposerInternal (baseUiModel, layouts, { logger }) {
  /**
   * Wraps the embeddable HTML contents of the specified file in a page layout.
   *
   * Builds a UI model from the file and its context, executes on the specified
   * page layout on that model, and assigns the result to the contents property
   * of the file. If no layout is specified on the file, the default layout is
   * used.
   *
   * @memberof page-composer
   *
   * @param {File} file - The virtual file the contains embeddable HTML
   *   contents to wrap in a layout.
   * @param {ContentCatalog} _contentCatalog - The content catalog
   *   that provides access to the virtual files in the site (ignored).
   * @param {NavigationCatalog} navigationCatalog - The navigation catalog
   *   that provides access to the navigation for each component version.
   * @returns {File} The file whose contents were wrapped in the specified page layout.
   */
  return function composePage (file, _contentCatalog, navigationCatalog) {
    // QUESTION should we pass the playbook to the uiModel?
    const uiModel = buildUiModel(baseUiModel, file, baseUiModel.contentCatalog, navigationCatalog)
    let layout = uiModel.page.layout
    if (!layouts.has(layout)) {
      if (layout === '404') throw new Error('404 layout not found')
      const defaultLayout = uiModel.site.ui.defaultLayout
      if (defaultLayout === layout) {
        throw new Error(`${layout} layout not found`)
      } else if (!layouts.has(defaultLayout)) {
        throw new Error(`Neither ${layout} layout or fallback ${defaultLayout} layout found`)
      }
      logger.warn("page layout '%s' specified by page not found; using default layout", layout)
      layout = defaultLayout
    }
    // QUESTION should we call trim() on result?
    file.contents = Buffer.from(layouts.get(layout)(uiModel))
    return file
  }
}

module.exports.register = function ({ playbook }) {
  this
    .on('contextStarted', () => {
      this.replaceFunctions({
        createPageComposer (playbook, contentCatalog, uiCatalog) {
            const layouts = uiCatalog
              .findByType('layout')
              .reduce(
                (accum, { path: srcName, stem, contents }) =>
                  accum.set(stem, require(ospath.join(process.cwd(), playbook.ui.bundle.url, srcName))),
                new Map()
              )
            const composePage = createPageComposerInternal(buildBaseUiModel(playbook, contentCatalog), layouts, {logger: this.getLogger()})
            const create404Page = (siteAsciiDocConfig) => {
              return composePage({
                asciidoc: siteAsciiDocConfig,
                mediaType: 'text/html',
                out: { path: '404.html' },
                pub: {},
                src: { stem: '404' },
                title: (siteAsciiDocConfig && siteAsciiDocConfig.attributes['404-page-title']) || 'Page Not Found',
              })
            }
            return Object.assign(composePage, { composePage, create404Page })
        }
      })
    })
    .on('navigationBuilt', async ({contentCatalog, uiCatalog, siteCatalog}) => {
      await opengraph.generate(contentCatalog.getPages().filter(page => page.asciidoc && page.src.basename !== 'index.adoc'))
      const rssItems = contentCatalog.getPages().filter(page => page.asciidoc && page.src.basename !== 'index.adoc')
      const uiModel = buildSiteUiModel(playbook, contentCatalog)
      const atomFeedModel = rss.generateAtomFeedModel(uiModel, rssItems)
      const composePage = this.getFunctions().createPageComposer(playbook, contentCatalog, uiCatalog)
      const articles = contentCatalog.getFiles().filter(file => file.asciidoc && file.src.basename !== 'index.adoc')
      siteCatalog.addFile(composePage(createRSSPage(atomFeedModel, articles)))
      const tags = getTags(contentCatalog)
      tags.forEach((tag) => {
        const articlesWithTag = articles.filter(file => {
          if (file.asciidoc && file.asciidoc.attributes && file.asciidoc.attributes['page-tags']) {
            return file.asciidoc.attributes['page-tags'].split(',').map(tag => tag.trim()).includes(tag)
          }
          return false;
        })
        siteCatalog.addFile(composePage(createTagPage(tag, articlesWithTag)))
      })
      siteCatalog.addFile(composePage(createIndexPage(tags, articles)))
    })
}


