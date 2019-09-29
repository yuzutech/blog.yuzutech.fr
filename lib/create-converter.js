const baseConverter = require('@antora/asciidoc-loader/lib/converter/html5')

function createConverter (callbacks) {
  class BlogConverter {
    constructor () {
      console.log('BlogConverter')
      this.baseConverter = baseConverter.$new('html5', undefined, callbacks)
    }

    $convert (node, transform, opts) {
      const transforms = require('../ui/bundle/layouts/_transforms')(this) // FIXME: resolve the path from the playbook
      const transformer = transforms[transform || node.node_name]
      console.log(transformer)
      if (transformer) {
        return transformer(node)
      }
      return this.baseConverter.$convert(node, transform, opts)
    }
  }

  return new BlogConverter()
}

module.exports = createConverter
