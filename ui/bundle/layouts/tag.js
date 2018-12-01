const icon = require('@fortawesome/fontawesome-svg-core').icon
const faRss = require('@fortawesome/free-solid-svg-icons').faRss
const faTags = require('@fortawesome/free-solid-svg-icons').faTags

const card = require('./_card')
const layout = require('./_layout')

function convert (uiModel) {
  const pagesHTML = card(uiModel)
  const tag = uiModel.page.attributes.tag
  const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="${uiModel.siteRootPath}/blog/1.0/">Blog</a>
            <span class="rss">
              <a href="${uiModel.siteRootPath}/blog/1.0/rss/feed.xml">
                ${icon(faRss).html}
              </a>
            </span>
          </h1>
        </div>
        <div class="container">
          <div class="tags cloud">
             ${icon(faTags).html}
            <span class="tag active is-medium"> ${tag} <a href="${uiModel.siteRootPath}/blog/1.0/" class="delete is-small"></a></span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        ${pagesHTML.join('\n')}
      </div>
    </div>
  </section>`
  return layout('Blog - Yuzu tech', content, uiModel)
}

module.exports = convert
