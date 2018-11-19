const header = require('./_header')
const footer = require('./_footer')

module.exports = (title, content, siteRelativeRoot) => {
  return `${header(title, siteRelativeRoot)}
${content}
${footer(siteRelativeRoot)}`
}
