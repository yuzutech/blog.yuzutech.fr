const fs = require('fs')
const path = require('path')

const _fs = function () {
}

// https://github.com/jprichardson/node-fs-extra/blob/master/lib/mkdirs/mkdirs-sync.js
_fs.prototype.mkdirsSync = function (p, made) {
  p = path.resolve(p)
  try {
    fs.mkdirSync(p)
    made = made || p
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT' :
        made = this.mkdirsSync(path.dirname(p), made)
        this.mkdirsSync(p, made)
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        let stat
        try {
          stat = fs.statSync(p)
        } catch (err1) {
          throw err0
        }
        if (!stat.isDirectory()) throw err0
        break
    }
  }
  return made
}

_fs.prototype.copySync = function (src, dest) {
  const bfs = this
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (exists && isDirectory) {
    fs.readdirSync(src).forEach(function (childItemName) {
      bfs.copySync(path.join(src, childItemName), path.join(dest, childItemName))
    })
  } else {
    this.mkdirsSync(path.dirname(dest))
    const data = fs.readFileSync(src)
    fs.writeFileSync(dest, data)
  }
}

module.exports = new _fs()
