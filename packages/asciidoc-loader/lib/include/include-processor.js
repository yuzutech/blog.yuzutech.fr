'use strict'

const Opal = global.Opal

const CIRCUMFIX_COMMENT_SUFFIX_RX = / (?:\*[/)]|--%?>)$/
const NEWLINE_RX = /\r\n?|\n/
const TAG_DELIMITER_RX = /[,;]/
const TAG_DIRECTIVE_RX = /\b(?:tag|(end))::(\S+)\[\]$/

const IncludeProcessor = (() => {
  const $callback = Symbol('callback')
  const superclass = Opal.module(null, 'Asciidoctor').Extensions.IncludeProcessor
  const scope = Opal.klass(
    Opal.module(null, 'Antora', function $Antora () {}),
    superclass,
    'IncludeProcessor',
    function () {}
  )

  Opal.defn(scope, '$initialize', function initialize (callback) {
    Opal.send(this, Opal.find_super_dispatcher(this, 'initialize', initialize))
    this[$callback] = callback
  })

  Opal.defn(scope, '$process', function (doc, reader, target, attrs) {
    const resolvedFile = this[$callback](doc, target, doc.getReader().getCursor())
    if (resolvedFile) {
      let includeContents = resolvedFile.contents
      let startLineNum = 1
      const tags = getTags(attrs)
      if (tags) [includeContents, startLineNum] = applyTagFiltering(includeContents, tags)
      Opal.hash_put(attrs, 'partial-option', true)
      reader.pushInclude(includeContents, resolvedFile.file, resolvedFile.path, startLineNum, attrs)
      if (resolvedFile.context) {
        ;(reader.file = new String(reader.file)).context = resolvedFile.context // eslint-disable-line no-new-wrappers
      }
    }
  })

  return scope
})()

function getTags (attrs) {
  if (attrs['$key?']('tag')) {
    const tag = attrs['$[]']('tag')
    if (tag && tag !== '!') {
      return tag.charAt() === '!' ? new Map().set(tag.substr(1), false) : new Map().set(tag, true)
    }
  } else if (attrs['$key?']('tags')) {
    const tags = attrs['$[]']('tags')
    if (tags) {
      let result = new Map()
      let any = false
      tags.split(TAG_DELIMITER_RX).forEach((tag) => {
        if (tag && tag !== '!') {
          any = true
          tag.charAt() === '!' ? result.set(tag.substr(1), false) : result.set(tag, true)
        }
      })
      if (any) return result
    }
  }
}

function applyTagFiltering (contents, tags) {
  let selecting, selectingDefault, wildcard
  if (tags.has('**')) {
    if (tags.has('*')) {
      selectingDefault = selecting = tags.get('**')
      wildcard = tags.get('*')
      tags.delete('*')
    } else {
      selectingDefault = selecting = wildcard = tags.get('**')
    }
    tags.delete('**')
  } else {
    selectingDefault = selecting = !Array.from(tags.values()).includes(true)
    if (tags.has('*')) {
      wildcard = tags.get('*')
      tags.delete('*')
    }
  }

  const lines = []
  const tagStack = []
  const usedTags = []
  let activeTag
  let lineNum = 0
  let startLineNum
  contents.split(NEWLINE_RX).forEach((line) => {
    lineNum++
    let m
    let l = line
    if (
      (l.endsWith('[]') ||
        (~l.indexOf('[] ') &&
          (m = l.match(CIRCUMFIX_COMMENT_SUFFIX_RX)) &&
          (l = l.substr(0, m.index)).endsWith('[]'))) &&
      (m = l.match(TAG_DIRECTIVE_RX))
    ) {
      const thisTag = m[2]
      if (m[1]) {
        if (thisTag === activeTag) {
          tagStack.shift()
          ;[activeTag, selecting] = tagStack.length ? tagStack[0] : [undefined, selectingDefault]
        } else if (tags.has(thisTag)) {
          const idx = tagStack.findIndex(([name]) => name === thisTag)
          if (~idx) {
            tagStack.splice(idx, 1)
            //console.warn(`line ${lineNum}: mismatched end tag in include: expected ${activeTag}, found ${thisTag}`)
          }
          //} else {
          //  //console.warn(`line ${lineNum}: unexpected end tag in include: ${thisTag}`)
          //}
        }
      } else if (tags.has(thisTag)) {
        usedTags.push(thisTag)
        tagStack.unshift([(activeTag = thisTag), (selecting = tags.get(thisTag))])
      } else if (wildcard !== undefined) {
        selecting = activeTag && !selecting ? false : wildcard
        tagStack.unshift([(activeTag = thisTag), selecting])
      }
    } else if (selecting) {
      if (!startLineNum) startLineNum = lineNum
      lines.push(line)
    }
  })
  // Q: use _.difference(Object.keys(tags), usedTags)?
  //const missingTags = Object.keys(tags).filter((e) => !usedTags.includes(e))
  //if (missingTags.length) {
  //  console.warn(`tag${missingTags.length > 1 ? 's' : ''} '${missingTags.join(',')}' not found in include`)
  //}
  return [lines, startLineNum || 1]
}

module.exports = IncludeProcessor
