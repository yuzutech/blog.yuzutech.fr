const fsExtra = require('../_fs')

fsExtra.copySync('./ui/build/images', 'public/images')
fsExtra.copySync('./ui/build/javascripts', 'public/javascripts')
fsExtra.copySync('./ui/build/stylesheets', 'public/stylesheets')
fsExtra.copySync('./ui/build/favicon.ico', 'public/favicon.ico')
