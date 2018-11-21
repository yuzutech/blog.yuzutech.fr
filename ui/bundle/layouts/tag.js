const tag = require('./_tag')
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
            <a href="${uiModel.siteRootPath}/index.html">Blog</a>
          </h1>
        </div>
        <div class="container">
          <div class="tags cloud">
            <i class="fa fa-tags label"></i>
            <span class="tag active is-medium"> ${tag} <a href="${uiModel.siteRootPath}/index.html" class="delete is-small"></a></span>
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
