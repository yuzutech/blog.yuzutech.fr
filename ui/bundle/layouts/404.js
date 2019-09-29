const icon = require('@fortawesome/fontawesome-svg-core').icon
const faRss = require('@fortawesome/free-solid-svg-icons').faRss
const faDizzy = require('@fortawesome/free-solid-svg-icons').faDizzy
const faArrowAltCircleLeft = require('@fortawesome/free-solid-svg-icons').faArrowAltCircleLeft

const layout = require('./_layout')

function convert (uiModel) {
  const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="${uiModel.siteRootPath}/blog/">Blog</a>
            <span class="rss">
              <a href="${uiModel.siteRootPath}/blog/rss/feed.xml">
                ${icon(faRss).html}
              </a>
            </span>
          </h1>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-404">
    <div class="container">
      <h1 class="title">Page not found ${icon(faDizzy).html}</h1>
      <h2 class="subtitle">${icon(faArrowAltCircleLeft).html} Back to the <a href="${uiModel.siteRootPath}/blog/">homepage</a></h2>
    </div>
  </section>`
  return layout('Blog - Yuzu tech', content, uiModel)
}

module.exports = convert
