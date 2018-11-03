const asciidoctor = require('asciidoctor.js')()

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
      this.transforms = {
        document: ({ node }) => {
          return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Yuzu tech, l'informatique sans pépins</title>
  <link rel="stylesheet" href="./stylesheets/main.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
 <section class="section">
    <div class="container">
      <h1 class="title">${node.getDocumentTitle()}</h1>
      <div class="author">
        <p class="title is-4">${node.getDocument().getAuthor()}</p>
      </div>
      ${node.getContent()}
    </div>
  </section>
</body>`
        },
        section: ({ node }) => {
          return `<section>
<h2 class="title is-2">${node.getTitle()}</h2>
${node.getContent()}
</section>`
        },
        paragraph: ({ node }) => {
          return `<p>${node.getContent()}</p>`
        },
        listing: ({node}) => {
          let preStart
          let preEnd
          let codeAttrs
          const nowrap = !(node.document.getAttribute('prewrap')) || (node.isOption('nowrap'))
          if (node.getStyle() === 'source') {
            const language = node.getAttribute('language', undefined, false)
            if (language) {
              codeAttrs = ` class="language-${language} hljs" data-lang=${language}`
            } else {
              codeAttrs = ''
            }
            const preClass = ` class="highlightjs highlight${nowrap ? ' nowrap' : ''}"`
            preStart = `<pre${preClass}><code${codeAttrs}>`
            preEnd = '</code></pre>'
          } else {
            preStart = `<pre${nowrap ? ' class="nowrap"' : ''}>`
            preEnd = '</pre>'
          }
          const titleElement = node.getTitle() ? `<div class="listing-title">${node.getCaptionedTitle()}</div>\n` : ''
          const idAttribute = node.getId() ? ` id="${node.getId()}"` : ''
          return `<div${idAttribute} class="listingblock${node.getRole() ? node.getRole() : ''}">
${titleElement}<div class="content">
${preStart}${node.getContent()}${preEnd}
</div>
</div>`
        },
        admonition: ({ node }) => {
          const idAttribute = node.getId() ? ` id="${node.getId()}"` : ''
          const name = node.getAttribute('name')
          const titleElement = node.getTitle() ? `<div class="listing-title">${node.getCaptionedTitle()}</div>\n` : ''
          return `<div${idAttribute} class="admonitionblock ${name}${node.getRole() ? node.getRole : ''}">
<table>
  <tr>
    <td class="icon">
      <div class="icon-${name}">📎</div>
    </td>
    <td class="content">
      ${titleElement}${node.getContent()}
    </td>
  </tr>
</table>
</div>`
        }
      }
    }

    $convert (node, transform, opts) {
      const transformer = this.transforms[node.node_name]
      if (transformer) {
        return transformer({ node })
      }
      return this.baseConverter.$convert(node, transform, opts)
    }
  }

  asciidoctor.Converter.Factory.$register(new BlogConverter('blog'), ['blog'])
}

function convert (filePath) {
  asciidoctor.convertFile(filePath, { backend: 'blog', to_dir: 'public' })
  console.log(`  convert ${filePath}`)
}

module.exports = {
  init: init,
  convert: convert
}
