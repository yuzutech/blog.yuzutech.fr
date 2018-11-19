const card = require('./_card')
const tag = require('./_tag')
const layout = require('./_layout')
const transforms = require('./_transforms')

function convertMainPage (pages) {
  const pagesHTML = card(pages, '.')
  const tagsHTML = tag.tagCloud(pages)
  const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="/">Blog</a>
          </h1>
        </div>
        <div class="container">
          <div class="tags cloud">
            <i class="fa fa-tags label"></i>
            ${tagsHTML.join('\n')}
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
  <script async defer src="./javascripts/main.js"></script>`
  return layout('Blog - Yuzu tech', content, '.')
}

function convertTagPage (pages, tag) {
  const siteRelativeRoot = '../..' // path is /tag/xyz
  const taggedPages = pages.filter(p => p.tags.includes(tag))
  const pagesHTML = card(taggedPages, siteRelativeRoot)
  const content = `<section class="hero">
    <div class="hero-body">
      <div class="container is-widescreen">
        <div class="titles">
          <h1 class="title">
            <a href="/">Blog</a>
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
  </section>`
  return layout(`Blog / ${tag} - Yuzu tech`, content, siteRelativeRoot)
}

function getTransforms () {
  return transforms;
}

module.exports = {
  convertMainPage: convertMainPage,
  convertTagPage: convertTagPage,
  getTransforms: getTransforms
}
