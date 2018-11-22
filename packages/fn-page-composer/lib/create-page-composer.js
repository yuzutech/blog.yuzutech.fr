'use strict'

const pageComposer = require('@antora/page-composer')

/**
 * Generates a function to wrap the page contents in a page layout.
 *
 * Compiles the layouts, along with the partials and helpers, and
 * builds the shared site UI model. Passes these objects to a generated
 * function, which can then be used to apply a layout template to pages.
 *
 * @memberof page-composer
 *
 * @param {Object} playbook - The configuration object for Antora.
 * @param {ContentCatalog} contentCatalog - The content catalog
 *   that provides access to the virtual files in the site.
 * @param {UiCatalog} uiCatalog - The file catalog
 *   that provides access to the UI files for the site.
 * @param {Object} [env=process.env] - A map of environment variables.
 * @param {Function} layoutResolver - A function to resolve "layout function" for a given file
 * @returns {Function} A function to compose a page (i.e., wrap the embeddable
 *   HTML contents in a standalone page layout).
 */
function createPageComposer (playbook, contentCatalog, uiCatalog, env = process.env, layoutResolver) {
  const layouts = uiCatalog
    .findByType('layout')
    .reduce(
      (accum, file) => accum.set(file.stem, layoutResolver(file)),
      new Map()
    )
  return createPageComposerInternal(pageComposer.buildSiteUiModel(playbook, contentCatalog), env, layouts)
}

function createPageComposerInternal (site, env, layouts) {
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
   * @param {ContentCatalog} contentCatalog - The content catalog
   *   that provides access to the virtual files in the site.
   * @param {NavigationCatalog} navigationCatalog - The navigation catalog
   *   that provides access to the navigation for each component version.
   * @returns {File} The file whose contents were wrapped in the specified page layout.
   */
  return function composePage (file, contentCatalog, navigationCatalog) {
    // QUESTION should we pass the playbook to the uiModel?
    const uiModel = pageComposer.buildUiModel(file, contentCatalog, navigationCatalog, site, env)

    let layout = uiModel.page.layout
    if (!layouts.has(layout)) {
      if (layout === '404') throw new Error('404 layout not found')
      const defaultLayout = uiModel.site.ui.defaultLayout
      if (defaultLayout === layout) {
        throw new Error(`${layout} layout not found`)
      } else if (!layouts.has(defaultLayout)) {
        throw new Error(`Neither ${layout} layout or fallback ${defaultLayout} layout found`)
      }
      // TODO log a warning that the default template is being used; perhaps on file?
      layout = defaultLayout
    }

    // QUESTION should we call trim() on result?
    file.contents = Buffer.from(layouts.get(layout)(uiModel))
    return file
  }
}

module.exports = createPageComposer
