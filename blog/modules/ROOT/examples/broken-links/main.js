const asciidoctor = require('asciidoctor.js')()

/*
link:subdir/foo.pdf[]
link:./subdir/foo.pdf[]
link:file://./subdir/foo.pdf[]
*/

// tag::convert[]
const input = `
* link:subdir/foo.pdf[]
* link:subdir/bar.pdf[]
* link:quz.pdf[]
* https://antoraa.org
* https://asciidoctor.org
* https://yuzutech.fr
* https://asciidoctor.org/doc
* http://neverssl.com`

const doc = asciidoctor.load(input, { 'catalog_assets': true }) // <1>
doc.convert() // <2>
const linksCatalog = doc.getLinks() // <3>
console.log(linksCatalog) // [ 'subdir/foo.pdf', 'subdir/bar.pdf', ... ]
// end::convert[]

// tag::check-http[]
const https = require('https')
const http = require('http')

const checkHttpLink = link => new Promise(resolve => {
  const module = link.startsWith('https://') ? https : http
  module.get(link, res => {
    const isError = res.statusCode >= 400 && res.statusCode < 600
    if (isError) { // <1>
      resolve({
        error: true,
        message: `Found a broken link: ${link} - Status code is: ${res.statusCode}`
      })
    } else { // <2>
      resolve({ error: false })
    }
  }).on('error', e => resolve({ // <3>
    error: true,
    message: `Found a broken link: ${link} - ${e}`
  }))
})
// end::check-http[]

// tag::check-file[]
const util = require('util')
const stat = util.promisify(require('fs').stat)

const checkFileLink = path => stat(path) // <1>
  .catch(error => ({
    error: true,
    message: `Found a broken link: ${path} - ${error.toString()}`
  }))
// end::check-file[]

// tag::check-all[]
const ospath = require('path')
const url = require('url')

const promises = linksCatalog.map((link) => {
  const uri = url.parse(link) // <1>
  if (uri.protocol === 'https:' || uri.protocol === 'http:') {
    return checkHttpLink(link) // <2>
  }
  if (uri.protocol === 'file:') {
    return checkFileLink(ospath.normalize(`${uri.host}${uri.path}`)) // <3>
  }
  if (uri.protocol === null) {
    return checkFileLink(link) // <4>
  }
  return Promise.resolve({ // <5>
    error: true,
    message: `Unsupported protocol ${uri.protocol}. Unable to check the ${link}.`
  })
})

Promise.all(promises)
  .then((result) => {
    const errors = result.filter(item => item.error === true)
    if (errors.length > 0) { // <6>
      errors.forEach(error => {
        console.log(error.message)
      })
      // abort the mission!
      process.exit(1) // <7>
    } else {
      // all good...
    }
  })
// end::check-all[]
