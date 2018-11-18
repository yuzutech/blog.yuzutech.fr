// preserve Boolean.call (used in immutable module)
const booleanCall = Boolean.call;

const asciidoctor = require('asciidoctor.js')()

// restore Boolean.call function
Boolean.call = booleanCall;

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
        document: (node) => {
          const monthNames = {
            0: 'Jan',
            1: 'Feb',
            2: 'Mar',
            3: 'Apr',
            4: 'May',
            5: 'Jun',
            6: 'Jul',
            7: 'Aug',
            8: 'Sep',
            9: 'Oct',
            10: 'Nov',
            11: 'Dec'
          }
          const revisionDate = new Date(node.getDocument().getAttribute('revdate'))
          const monthName = monthNames[revisionDate.getMonth()];
          return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Yuzu tech, l'informatique sans pépins</title>
  <link rel="stylesheet" href="./stylesheets/prism.css" />
  <link rel="stylesheet" href="./stylesheets/prism-line-highlight.css" />
  <link rel="stylesheet" href="./stylesheets/main.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://www.yuzutech.fr">
        <img src="./images/logo_100.png" alt="Yuzu tech">
      </a>
      <a role="button" class="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <a class="navbar-item" href="https://www.yuzutech.fr/#metier">
          Notre métier
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#offres">
          Nos offres
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#clients">
          Nos clients
        </a>
        <a class="navbar-item" href="https://www.yuzutech.fr/#contact">
          Contact
        </a>
      </div>
    </div>
  </nav>
  <section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            Blog
          </h1>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="meta">
        <div class="avatar">by</div>
        <div class="byline">
          <span class="author">${node.getDocument().getAuthor()}</span><time datetime="${revisionDate}">${monthName} ${revisionDate.getDate()}, ${revisionDate.getFullYear()}</time>
        </div>
      </div>
      <h1 class="title">${node.getDocumentTitle()}</h1>
      <div class="content">
        ${node.getContent()}
      </div>
    </div>
  </section>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="content has-text-centered">
            <h3 id="contact">Contact</h3>
            <p>
              <strong>Yuzu tech</strong><br/>
              69100 Villeurbanne<br/>
              <br/>
              <a href="tel:+33673910445">06 73 91 04 45</a><br/>
              <a href="mailto:info@yuzutech.fr">info@yuzutech.fr</a>
            </p>
          </div>
        </div>
        <div class="column">
          <div class="content has-text-centered">
            <h3>Social</h3>
            <div class="social-link">
              <a href="https://twitter.com/yuzutechfr" class="social-twitter">
                <i class="fab fa-twitter-square"></i> Twitter
              </a>
            </div>
            <div class="social-link">
              <a href="https://google.com/+YuzutechFr" class="social-google-plus">
                <i class="fab fa-google-plus-square"></i> Google +
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <script async defer src="./javascripts/main.js"></script>
</body>`
        },
        section: (node) => {
          return `<section>
<h2 class="title is-2">${node.getTitle()}</h2>
${node.getContent()}
</section>`
        },
        paragraph: (node) => {
          return `<p>${node.getContent()}</p>`
        },
        listing: (node) => {
          let preStart
          let preEnd
          let codeAttrs
          const nowrap = !(node.document.getAttribute('prewrap')) || (node.isOption('nowrap'))
          if (node.getStyle() === 'source') {
            const language = node.getAttribute('language', undefined, false)
            if (language) {
              codeAttrs = ` class="language-${language}" data-lang=${language}`
            } else {
              codeAttrs = ''
            }
            const dataLine = node.getAttribute('callout-lines') ? ` data-line="${node.getAttribute('callout-lines')}"` : ''
            const preClass = ` class="${nowrap ? 'nowrap' : ''}"${dataLine}`
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
        admonition: (node) => {
          const idAttribute = node.getId() ? ` id="${node.getId()}"` : ''
          const name = node.getAttribute('name')
          const titleElement = node.getTitle() ? `<div class="listing-title">${node.getCaptionedTitle()}</div>\n` : ''
          return `<div${idAttribute} class="box ${name}${node.getRole() ? node.getRole() : ''}">
  <article class="media">
    <div class="media-left">
      <figure class="image">
        <span class="icon has-text-info">
          <i class="fas fa-info-circle"></i>
        </span>
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        ${titleElement}${node.getContent()}
      </div>
    </div>
  </article>
</div>`
        },
        literal: (node) => {
          const idAttribute = node.getId() ? ` id="${node.getId()}"` : ''
          const titleElement = node.getTitle() ? `<div class="title">${node.getTitle()}</div>\n` : ''
          const nowrap = !(node.document.hasAttribute('prewrap')) || (node.isOption('nowrap'))
          return `<div${idAttribute} class="literalblock${node.getRole() ? ` ${node.getRole()}` : ''}">
${titleElement}<div class="content">
<pre${nowrap ? ' class="nowrap"' : ''}>${node.getContent()}</pre> 
</div>
</div>`
        },
        inline_callout: (node) => {
          return `<i class="conum" data-value="${node.text}"></i>`
        }
      }
    }

    $convert (node, transform, opts) {
      const transformer = this.transforms[transform || node.node_name]
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
      const calloutLines = [];
      for (let listing of listings) {
        const lines = listing.getSourceLines()
        for (let index in lines) {
          const line = lines[index]
          if (line.trim().match(/\/\/ <[0-9]+>$/)) {
            calloutLines.push(parseInt(index) + 1) // 0-based index
          }
        }
        listing.setAttribute('callout-lines', calloutLines.join(','))
      }
      //console.log(listingBlocks)
      //doc.getBlocks()[0] = self.createBlock(doc, 'paragraph', 'GDPR compliant :)')
      return doc
    })
  })
  return asciidoctor.convertFile(filePath, { safe: 'safe', to_dir: 'public', extension_registry: registry })
}

module.exports = {
  init: init,
  convert: convert
}
