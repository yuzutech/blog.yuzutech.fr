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
      if (node.getType() === 'icon' && node.getDocument().isAttribute('icons', 'svg')) {
        const transform = {}
        if (node.hasAttribute('rotate')) {
          transform.rotate = node.getAttribute('rotate') // <1>
        }
        if (node.hasAttribute('flip')) {
          const flip = node.getAttribute('flip') // <2>
          if (flip === 'vertical' || flip === 'y' || flip === 'v') {
            transform.flipY = true
          } else {
            transform.flipX = true
          }
        }
        const options = {}
        options.transform = transform
        if (node.hasAttribute('title')) {
          options.title = node.getAttribute('title') // <3>
        }
        options.classes = []
        if (node.hasAttribute('size')) {
          options.classes.push(`fa-${node.getAttribute('size')}`) // <4>
        }
        if (node.getRoles()) {
          options.classes = node.getRoles().map(value => value.trim()) // <5>
        }
        const meta = {}
        if (node.hasAttribute('prefix')) {
          meta.prefix = node.getAttribute('prefix')
        }
        meta.iconName = node.getTarget()
        const faIcon = icon(meta, options)
        if (faIcon) {
          return faIcon.html
        }
      } else {
        return this.baseConverter.$inline_image(node)
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

const input = `.Size & title
Do you want to drink a small icon:cocktail[sm] or a tall icon:beer[2x,title=pint] ?

.Fixed-width
icon:ruler-vertical[fw] vertical ruler +
icon:ruler-horizontal[fw] horizontal ruler

.Rotate
icon:flag[rotate=90] +
icon:flag[rotate=180] +
icon:flag[rotate=270] +
icon:flag[flip=horizontal] +
icon:flag[flip=vertical]

.Spin and pulse
We are working on it icon:cog[spin], please wait icon:spinner[role=fa-pulse]

.Roles
icon:heart[role=is-primary] icon:heart[role=is-success] icon:heart[role=is-warning] icon:heart[role=is-danger]`

const options = {
  header_footer: true,
  safe: 'safe',
  extension_registry: registry
}
console.log(asciidoctor.convert(input, options)) // <1>
