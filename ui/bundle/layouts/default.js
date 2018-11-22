const layout = require('./_layout')
const date = require('./_date')

function convert (uiModel) {
  const page = uiModel.page
  uiModel.enableDisqus = true;
  const revisionDate = new Date(page.attributes.revdate)
  const author = page.attributes.author
  const title = page.title
  const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="${uiModel.siteRootPath}/index.html">Blog</a>
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
          <span class="author">${author}</span><time datetime="${revisionDate}">${date.getShortRevisionDate(revisionDate)}</time>
        </div>
      </div>
      <h1 class="title">${title}</h1>
      <div class="content">
        ${page.contents.toString()}
      </div>
    </div>
  </section>`
  return layout(`${uiModel.page.title} - Yuzu tech`, content, uiModel)
}

module.exports = convert
