const baseConverter = require('@antora/asciidoc-loader/lib/converter/html5')

function createConverter () {
  return (callbacks) => {
    class BlogConverter {
      constructor () {
        this.baseConverter = baseConverter.$new('html5', undefined, callbacks)
      }

      $convert (node, transform, opts) {
        const transforms = require('../ui/layouts/_transforms') // FIXME: Use a proper path
        const transformer = transforms[transform || node.node_name]
        if (transformer) {
          return transformer(node)
        }
        return this.baseConverter.$convert(node, transform, opts)
      }
    }
    return new BlogConverter()
  }
}

module.exports = createConverter()
