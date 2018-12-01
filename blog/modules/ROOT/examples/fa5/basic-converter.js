const asciidoctor = require('asciidoctor.js')()

const library = require('@fortawesome/fontawesome-svg-core').library;
const icon = require('@fortawesome/fontawesome-svg-core').icon;
const fas = require('@fortawesome/free-solid-svg-icons').fas
const far = require('@fortawesome/free-regular-svg-icons').far
const fab = require('@fortawesome/free-brands-svg-icons').fab
library.add(fas, far, fab)

class TemplateConverter {
  constructor () {
    this.baseConverter = asciidoctor.Html5Converter.$new()
    // tag::inline-image[]
    const inlineImage = (node) => {
      if (node.getType() === 'icon' // <1>
        && node.getDocument().isAttribute('icons', 'svg')) { // <2>
        const search = {}
        search.iconName = node.getTarget() // <3>
        if (node.hasAttribute('prefix')) {
          search.prefix = node.getAttribute('prefix') // <4>
        }
        const faIcon = icon(search)
        if (faIcon) {
          return faIcon.html // <5>
        }
      } else {
        return this.baseConverter.$inline_image(node) // <6>
      }
    }
    // end::inline-image[]
    this.templates = {
      inline_image: inlineImage
    }
  }

  convert (node, transform, opts) {
    const template = this.templates[transform || node.node_name]
    if (template) {
      return template(node)
    }
    return this.baseConverter.convert(node, transform, opts)
  }
}

asciidoctor.ConverterFactory.register(new TemplateConverter(), ['html5'])

// tag::docinfo-style[]
const dom = require('@fortawesome/fontawesome-svg-core').dom;
const registry = asciidoctor.Extensions.create()
registry.docinfoProcessor(function () {
  const self = this
  self.atLocation('head')
  self.process(function () {
    return `<style>${dom.css()}</style>` // <1>
  })
})
// end::docinfo-style[]

// tag::usage[]
const input = `You can enable icon:flask[] experimental features on icon:gitlab[prefix=fab] GitLab.`
const options = {
  header_footer: true,
  safe: 'safe',
  extension_registry: registry,
  attributes: { icons: 'svg' }
}
console.log(asciidoctor.convert(input, options)) // <1>
// end::usage[]
