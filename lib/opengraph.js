const fs = require('fs').promises
const path = require('path')
const os = require('os')
const puppeteer = require('puppeteer')
const chroma = require('chroma-js')

const imagesDir = path.join(__dirname, '..', 'ui', 'bundle', 'images')

async function openGraphCardTemplate(page, styles) {
  const doctitle = page.asciidoc.doctitle
  const author = page.asciidoc.attributes['page-author']
  const authorSlug = author.toLowerCase().replace(/\s/g, '-')
  const primaryColor = page.asciidoc.attributes['page-color-primary']
  let title
  let category = ''
  if (doctitle.includes(': ')) {
    [category, title] = doctitle.split(': ')
  } else {
    title = doctitle
  }
  let avatarDataUri
  try {
    const avatarBuffer = await fs.readFile(path.join(imagesDir, `author-avatar-${authorSlug}.jpeg`))
    avatarDataUri = `data:image/gif;base64,${avatarBuffer.toString('base64')}`
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      // avatar does not exists, fallback..
    } else {
      // unexpected error, throw!
      throw err
    }
  }
  const avatarStyles = avatarDataUri ?
    `
.avatar {
  background-image: url(${avatarDataUri});
}
` : `
.avatar::after {
  content: 'by';
  display: flex;
  line-height: 1rem;
  align-items: baseline;
}
`
  const words = title.split(' ')
  // prevent a line break on the last word
  words.splice(words.length - 2, 0, '<span class="nobr">')
  words.push('</span>')
  title = words.join(' ')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${styles}
    .meta {
      background-color: ${primaryColor};
    }
    .author {
      text-shadow: 0.25rem 0.25rem ${chroma(primaryColor).darken().hex(2)};
    }
    .avatar {
      background-color: ${chroma(primaryColor).darken().hex()};
    }
    ${avatarStyles}
  </style>
</head>
<body>
  <main>
    <section>
      <header>
        <div class="meta">
          <div class="avatar"></div>
          <div class="byline">     
            <span class="author">${author}</span>
          </div>
        </div>
        <div class="text">
          ${category ? `<h2 class="category">${category}</h2>` : ''}
          <h1 class="title">${title}</h1>
        </div>
      </header>
    </section>  
  </main>
</body>`
}

async function generateOpenGraphImages (puppeteerPage, page) {
  await puppeteerPage.goto(page.url)

  // Prepare viewport for OpenGraph image
  // Those dimension seems to be the recommendation for Facebook/Twitter
  await puppeteerPage.setViewport({ width: 1200, height: 630 })
  const opengraphImagePath = path.join(imagesDir, 'opengraph', `${page.basename}.jpg`)
  await puppeteerPage.screenshot({ path: opengraphImagePath, quality: 100 })

  // Prepare viewport for atom feed image
  // Feedly seems to use 4/3 images
  await puppeteerPage.setViewport({ width: 1200, height: 900 })
  const feedImagePath = path.join(imagesDir, 'feed-preview', `${page.basename}.jpg`)
  await puppeteerPage.screenshot({ path: feedImagePath, quality: 100 })
}

async function generate (pages) {
  // Start browser
  const browser = await puppeteer.launch()
  const styleContents = await fs.readFile(path.join(__dirname, '..', 'ui', 'src', 'stylesheets', 'article-og-image.css'))
  try {
    const puppeteerPage = await browser.newPage()
    for (const page of pages) {
      const html = await openGraphCardTemplate(page, styleContents)
      const basename = path.basename(page.src.basename, '.adoc')
      const tempFilePath = path.join(os.tmpdir(), `${basename}.html`)
      await fs.writeFile(tempFilePath, html, 'utf8')
      const url = `file://${tempFilePath}`
      await generateOpenGraphImages(puppeteerPage, {url, basename})
    }
  } finally {
    await browser.close()
  }
}

module.exports = {
  generate: generate
}
