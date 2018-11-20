const booleanCall = Boolean.call; // preserve Boolean.call (used in immutable module)
const asciidoctor = require('asciidoctor.js')()
Boolean.call = booleanCall; // restore Boolean.call function

function createConverter(config) {
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
      const templates = require(config.templateModule)
      const transforms = templates.getTransforms()
      const transformer = transforms[transform || node.node_name]
      if (transformer) {
        return transformer(node)
      }
      return this.baseConverter.$convert(node, transform, opts)
    }
  }
  return new BlogConverter()
}

function load (filePath, converter) {
  console.log(`  load ${filePath}`)
  const registry = asciidoctor.Extensions.create()
  registry.treeProcessor(function () {
    const self = this;
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
  return asciidoctor.loadFile(filePath, { header_footer: true, safe: 'safe', converter, extension_registry: registry })
}

function generateTagPages (pages, templates, config) {
  const tags = new Set()
  for (let page of pages) {
    for (let tag of page.tags) {
      tags.add(tag)
    }
  }
  const files = []
  for (let tag of tags) {
    const tagDir = tag.toLowerCase().replace('.', '-')
    const dir = `${config.outDirectory}/tag/${tagDir}`
    files.push({
      base: dir,
      path: `${dir}/index.html`,
      contents: templates.convertTagPage(pages, tag)
    })
  }
  return files
}

module.exports = {
  createConverter: createConverter,
  load: load,
  generateTagPages: generateTagPages
}
