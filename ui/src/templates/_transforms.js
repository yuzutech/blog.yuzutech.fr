const layout = require('./_layout')
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

module.exports = {
  document: (node) => {
    const revisionDate = new Date(node.getDocument().getAttribute('revdate'))
    const monthName = monthNames[revisionDate.getMonth()];
    const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="/">Blog</a>
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
  </section>`
    return layout(`${node.getDocumentTitle()} - Yuzu tech`, content, '.')
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
    const nowrap = !(node.getDocument().getAttribute('prewrap')) || (node.isOption('nowrap'))
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
    let iconName;
    if (name === 'note') {
      iconName = 'info-circle'
    } else if (name === 'important') {
      iconName = 'exclamation-circle'
    }
    return `<div${idAttribute} class="box ${name}${node.getRole() ? node.getRole() : ''}">
  <article class="media">
    <div class="media-left">
      <figure class="image">
        <span class="icon has-text-${name}">
          <i class="fas fa-${iconName}"></i>
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
    const nowrap = !(node.getDocument().hasAttribute('prewrap')) || (node.isOption('nowrap'))
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
