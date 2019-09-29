'use strict'

const computeRelativeUrlPath = require('../util/compute-relative-url-path')

function convertImageRef (resourceSpec, currentPage, contentCatalog) {
  try {
    const resolved = contentCatalog.resolveResource(resourceSpec, currentPage.src, ['image'], 'image')
    if (resolved) return computeRelativeUrlPath(currentPage.pub.url, resolved.pub.url)
  } catch (e) {} // TODO enforce valid ID spec
}

module.exports = convertImageRef
