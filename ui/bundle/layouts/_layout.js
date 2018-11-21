const header = require('./_header')
const footer = require('./_footer')

module.exports = (title, content, uiModel) => {
  return `${header(title, uiModel)}
${content}
${footer(uiModel)}`
}
