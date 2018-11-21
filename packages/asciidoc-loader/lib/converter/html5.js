'use strict'

const Opal = global.Opal
const $pageRefCallback = Symbol('callback')

const Html5Converter = (() => {
  const scope = Opal.klass(
    Opal.module(null, 'Antora'),
    Opal.module(null, 'Asciidoctor').Converter.Html5Converter,
    'Html5Converter',
    function () {}
  )
  Opal.defn(scope, '$initialize', function initialize (backend, opts, callbacks) {
    Opal.send(this, Opal.find_super_dispatcher(this, 'initialize', initialize), [backend, opts])
    this[$pageRefCallback] = callbacks.onPageRef
  })
  Opal.defn(scope, '$inline_anchor', function inlineAnchor (node) {
    if (node.getType() === 'xref') {
      let refSpec = node.getAttribute('refid')
      if (
        node.getAttribute('path') ||
        // NOTE refSpec is undefined if inter-document xref refers to current docname and fragment is empty
        // TODO remove check for file extension after upgrading to 1.5.7
        (refSpec && refSpec.endsWith('.adoc') && (refSpec = refSpec.substr(0, refSpec.length - 5)) !== undefined)
      ) {
        const callback = this[$pageRefCallback]
        if (callback) {
          const { content, target } = callback(refSpec, node.getText())
          let options
          if (target.charAt() === '#') {
            options = Opal.hash2(['type', 'target'], { type: 'link', target })
          } else {
            // TODO pass attributes (e.g., id, role) after upgrading to 1.5.7
            const attributes = Opal.hash2(['role'], { role: 'page' })
            options = Opal.hash2(['type', 'target', 'attributes'], { type: 'link', target, attributes })
          }
          node = Opal.module(null, 'Asciidoctor').Inline.$new(node.getParent(), 'anchor', content, options)
        }
      }
    }
    return Opal.send(this, Opal.find_super_dispatcher(this, 'inline_anchor', inlineAnchor), [node])
  })
  return scope
})()

module.exports = Html5Converter
