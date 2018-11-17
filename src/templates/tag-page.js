function get (pages, tag) {
  const taggedPages = pages.filter(p => p.tags.includes(tag))
  const pagesHTML = taggedPages.map((page, index) => {
    const tagsHTML = page.tags.map(tag => `<a href="/tag/${tag.toLowerCase().replace('.', '-')}/" class="tag is-light has-icon">
<span class="icon">
  <i class="fas fa-tag"></i> ${tag}
</span>
</a>`)
    const imageHTML = page.image ? `<div class="card-image">
  <img src="../../images/${page.image}" alt="${page.doc.getTitle()} illustration">
</div>` : ''
    return `<div class="column${index === 0 ? ' is-full' : ' is-one-third'}">
<div class="card article${index === 0 ? ' card-featured' : ''}">
  ${imageHTML}
  <div class="card-content">
    <a href="${page.href}" class="summary">
      <time datetime="${page.revisionDate}">${page.revisionDateShortFormat}</time>
      <h2 class="article-title">
      ${page.doc.getTitle()}
      </h2>
      <p class="excerpt">
      ${page.description}
      </p>
    </a>
    <p class="tags is-condensed">
      ${tagsHTML.join('\n')}
    </p>
  </div>
</div>
</div>`
  })
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog / ${tag} - Yuzu tech</title>
  <link rel="stylesheet" href="../../stylesheets/main.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://www.yuzutech.fr">
        <img src="../../images/logo_100.png" alt="Yuzu tech">
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
        <div class="container">
          <div class="tags cloud">
            <i class="fa fa-tags label"></i>
            <span class="tag active is-medium"> ${tag} <a href="/" class="delete is-small"></a></span>
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
  <script async defer src="../javascripts/main.js"></script>
</body>`
}

module.exports = {
  get: get
}
