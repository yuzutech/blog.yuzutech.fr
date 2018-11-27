const layout = require('./_layout')

function convert (uiModel) {
  const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="${uiModel.siteRootPath}/index.html">Blog</a>
            <span class="rss">
              <a href="${uiModel.siteRootPath}/blog/1.0/rss/feed.xml"><i class="fas fa-rss"></i></a>
            </span>
          </h1>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-404">
    <div class="container">
      <h1 class="title">Page not found <i class="far fa-dizzy"></i></h1>
      <h2 class="subtitle"><i class="fas fa-undo-alt"></i> Back to the <a href="${uiModel.siteRootPath}/index.html">homepage</a></h2>
    </div>
  </section>`
  return layout('Blog - Yuzu tech', content, uiModel)
}

module.exports = convert
