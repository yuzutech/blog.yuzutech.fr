const booleanCall = Boolean.call; // preserve Boolean.call (used in immutable module)
const asciidoctor = require('asciidoctor.js')()
Boolean.call = booleanCall; // restore Boolean.call function

function init () {
  const HTML5Converter = Opal.const_get_qualified(
    Opal.const_get_qualified(
      Opal.const_get_relative(Opal, 'Asciidoctor'),
      'Converter'
    ),
    'Html5Converter'
  )
  class BlogConverter {
    constructor () {
      this.baseConverter = HTML5Converter.$new()
    }

    $convert (node, transform, opts) {
      const templates = require('../../ui/src/templates/index')
      const transforms = templates.getTransforms()
      const transformer = transforms[transform || node.node_name]
      if (transformer) {
        return transformer(node)
      }
      return this.baseConverter.$convert(node, transform, opts)
    }
  }
  asciidoctor.Converter.Factory.$register(new BlogConverter(), ['html5'])
}

function convert (filePath) {
  console.log(`  convert ${filePath}`)
  const registry = asciidoctor.Extensions.create()
  registry.postprocessor(function () {
    const self = this;
    self.process(function (doc, output) {
      //console.log(output)
      return output
    })
  })
  registry.treeProcessor(function () {
    var self = this;
    self.process(function (doc) {
      const listings = doc.findBy({ context: 'listing' })
      for (let listing of listings) {
        const calloutLines = [];
        const lines = listing.getSourceLines()
        for (let index in lines) {
          const line = lines[index]
          if (line.trim().match(/\/\/ <[0-9]+>$/)) {
            calloutLines.push(parseInt(index) + 1) // 0-based index
          }
        }
        listing.setAttribute('callout-lines', calloutLines.join(','))
      }
      return doc
    })
  })
  registry.blockMacro(function () {
    const self = this;
    self.named('gist')
    self.process(function (parent, target, attrs) {
      const titleHTML = attrs.title ? `<div class="title">${attrs.title}</div>\n` : ''
      const html = `<div class="openblock gist">
  ${titleHTML}<div class="content">
    <script src="https://gist.github.com/${target}.js"></script>
  </div>
</div>`
      return self.createBlock(parent, 'pass', html, attrs, {})
    });
  });
  return asciidoctor.convertFile(filePath, { safe: 'safe', to_dir: 'public', extension_registry: registry })
}

module.exports = {
  init: init,
  convert: convert
}
