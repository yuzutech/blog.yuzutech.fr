const icon = require('@fortawesome/fontawesome-svg-core').icon
const faRss = require('@fortawesome/free-solid-svg-icons').faRss
const faGithubAlt = require('@fortawesome/free-brands-svg-icons').faGithubAlt
const faTwitter = require('@fortawesome/free-brands-svg-icons').faTwitter

const layout = require('./_layout')
const date = require('./_date')

function convert (uiModel) {
  const page = uiModel.page
  uiModel.enableDisqus = true
  const revisionDate = new Date(page.attributes.revdate)
  const author = page.attributes.author
  const title = page.title
  const colorPrimary = page.attributes['color-primary']
  const colorSecondary = page.attributes['color-secondary']
  let disqusHTML = ''
  if (uiModel.enableDisqus) {
    disqusHTML = `<aside>
    <div id="disqus_thread"></div>
  </aside>
  <script>
    var disqus_config = function () {
      this.page.url = '${uiModel.page.canonicalUrl}';
      this.page.identifier = '${uiModel.page.url}';
    };
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://blog-yuzutech.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  </script>
  <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>`
  }
  const content = `<section class="hero" style="background: ${colorPrimary}">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title" style="text-shadow: 3px 3px ${colorSecondary}"">
            <a href="${uiModel.siteRootPath}/blog/1.0/">Blog</a>
            <span class="rss">
              <a href="${uiModel.siteRootPath}/blog/1.0/rss/feed.xml">
                ${icon(faRss, { styles: { 'color': colorSecondary }}).html}
              </a>
            </span>
          </h1>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-blog-post">
    <main class="container">
      <article>
        <header>
          <div class="meta">
            <div class="avatar">by</div>
            <div class="byline">     
              <span class="author">${author}</span><time datetime="${revisionDate}">${date.getShortRevisionDate(revisionDate)}</time>
            </div>
          </div>
          <h1 class="title">${title}</h1>
        </header>
        <div class="content">
          ${page.contents.toString()}
        </div>
        <footer>
          <a class="discuss-twitter" href="https://twitter.com/search?q=${encodeURIComponent(page.canonicalUrl)}" target="_blank" rel="noopener noreferrer">${icon(faTwitter).html} Discuss on Twitter</a>
          <a class="edit-this-page" href="${page.editUrl}" target="_blank" rel="noopener noreferrer">${icon(faGithubAlt).html} Edit on GitHub</a>
        </footer>
      </article>
    </main>
    ${disqusHTML}
  </section>`
  return layout(`${uiModel.page.title} - Yuzu tech`, content, uiModel)
}

module.exports = convert
