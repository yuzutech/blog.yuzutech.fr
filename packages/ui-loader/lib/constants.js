'use strict'

module.exports = Object.freeze({
  FILE_MODE: 0o100666 & ~process.umask(),
  SUPPLEMENTAL_FILES_GLOB: '**/*',
  UI_CACHE_FOLDER: 'ui',
  UI_DESC_FILENAME: 'ui.yml',
})
