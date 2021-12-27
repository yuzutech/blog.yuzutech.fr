'use strict'

const Asciidoctor = require('@asciidoctor/core')()
const Opal = global.Opal

const baseConverter = Asciidoctor.Converter.$for('html5')
const classDef = Opal.klass(null, baseConverter, 'BlogConverter')
classDef.$register_for('html5')
classDef.baseConverter = baseConverter.$$prototype
Opal.defn(classDef, '$convert', (node, transform, opts) => {
  const transforms = require('../ui/bundle/layouts/_transforms')(classDef) // FIXME: resolve the path from the playbook
  const transformer = transforms[transform || node.node_name]
  if (transformer) {
    return transformer(node)
  }
  return classDef.baseConverter.$convert(node, transform, opts)
})
