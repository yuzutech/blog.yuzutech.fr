const library = require('@fortawesome/fontawesome-svg-core').library
const {icon, layer} = require('@fortawesome/fontawesome-svg-core')

let soldIcon
let faLightbulb
try {
  soldIcon = require('@fortawesome/pro-solid-svg-icons')
  faLightbulb = soldIcon.faLightbulbOn
} catch (e) {
  soldIcon = require('@fortawesome/free-solid-svg-icons')
  faLightbulb = soldIcon.faLightbulb
}

const faCircle = soldIcon.faCircle
const faLightbulbCircleIcon = layer((push) => {
  push(icon(faCircle))
  push(icon(faLightbulb, { transform: { size: 8, x: -2 }, classes: 'fa-inverse' }))
})
const faInfoCircleIcon = icon(soldIcon.faInfoCircle)
const faExclamationCircleIcon = icon(soldIcon.faExclamationCircle)
const faQuestionCircleIcon = icon(soldIcon.faQuestionCircle)
const faFireIcon = icon(soldIcon.faFire)
const fas = soldIcon.fas
let far
try {
  far = require('@fortawesome/pro-regular-svg-icons').far
} catch (e) {
  far = require('@fortawesome/free-regular-svg-icons').far
}
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
      const titleElement = node.getTitle() ? `<div class="title">${node.getTitle()}</div>` : ''
      return `<div class="paragraph">
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
        faIcon = faInfoCircleIcon
      } else if (name === 'important') {
        faIcon = faExclamationCircleIcon
      } else if (name === 'caution') {
        faIcon = faFireIcon
      } else if (name === 'tip') {
        faIcon = faLightbulbCircleIcon
      } else {
        faIcon = faQuestionCircleIcon
      }
      return `<div${idAttribute} class="box ${name}${node.getRole() ? node.getRole() : ''}">
  <article class="media">
    <div class="media-left">
      <figure class="image">
        <span class="icon has-text-${name}">
          ${faIcon.html}
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
    },
    colist: (node) => {
      const result = []
      const idAttribute = node.getId() ? ` id="${node.getId()}"` : ''
      let classes = ['colist']
      if (node.getStyle()) {
        classes = classes.concat(node.getStyle())
      }
      if (node.getRole()) {
        classes = classes.concat(node.getRole())
      }
      const classAttribute = ` class="${classes.join(' ')}"`
      result.push(`<div${idAttribute}${classAttribute}>`)
      if (node.getTitle()) {
        result.push(`<div class="title">${node.getTitle()}</div>`)
      }
      if (node.getDocument().hasAttribute('icons')) {
        result.push('<table>')
        let num = 0
        const svgIcons = node.getDocument().isAttribute('icons', 'svg')
        let numLabel
        node.getItems().forEach((item) => {
          num += 1
          if (svgIcons) {
            numLabel = `<i class="conum" data-value="${num}"></i><b>${num}</b>`
          } else {
            numLabel = `<i class="conum" data-value="${num}"></i><b>${num}</b>`
          }
          result.push(`<tr>
          <td>${numLabel}</td>
          <td>${item.getText()}${item['$blocks?']() ? `\n ${item.getContent()}` : ''}</td>
          </tr>`)
        })
        result.push('</table>')
      } else {
        result.push('<ol>')

        node.getItems().forEach((item) => {
          result.push(`<li>
<p>${item.getText()}</p>${item['$blocks?']() ? `\n ${item.getContent()}` : ''}`)
        })
        result.push('</ol>')
      }
      result.push('</div>')
      return result.join('\n')
    }
  }
}
