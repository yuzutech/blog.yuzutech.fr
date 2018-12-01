const library = require('@fortawesome/fontawesome-svg-core').library
const icon = require('@fortawesome/fontawesome-svg-core').icon
const faInfoCircle = require('@fortawesome/free-solid-svg-icons').faInfoCircle
const faExclamationCircle = require('@fortawesome/free-solid-svg-icons').faExclamationCircle
const faQuestionCircle = require('@fortawesome/free-solid-svg-icons').faQuestionCircle
const faFire = require('@fortawesome/free-solid-svg-icons').faFire
const fas = require('@fortawesome/free-solid-svg-icons').fas
const far = require('@fortawesome/free-regular-svg-icons').far
const fab = require('@fortawesome/free-brands-svg-icons').fab
library.add(fas, far, fab)

module.exports = (self) => {
  return {
    section: (node) => {
      return `<section class="section is-small">
<h2 class="title is-4">${node.getTitle()}</h2>
${node.getContent()}
</section>`
    },
    paragraph: (node) => {
      const title = node.getTitle()
      const titleElement =  node.getTitle() ? `<div class="title">${node.getTitle()}</div>` : ''
      return `<div class="paragrah">
  ${titleElement}
  <p>${node.getContent()}</p>
</div>`
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
      let faIcon
      if (name === 'note') {
        faIcon = faInfoCircle
      } else if (name === 'important') {
        faIcon = faExclamationCircle
      } else if (name === 'caution') {
        faIcon = faFire
      } else {
        faIcon = faQuestionCircle
      }
      return `<div${idAttribute} class="box ${name}${node.getRole() ? node.getRole() : ''}">
  <article class="media">
    <div class="media-left">
      <figure class="image">
        <span class="icon has-text-${name}">
          ${icon(faIcon).html}
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
    },
    inline_image: (node) => {
      if (node.getType() === 'icon' && node.getDocument().isAttribute('icon', 'svg')) {
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
        if (node.getRoles() && node.getRoles().length > 0) {
          options.classes = options.classes.concat(node.getRoles().map(value => value.trim())) // <5>
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
        return self.baseConverter.$inline_image(node)
      }
    }
  }
}
