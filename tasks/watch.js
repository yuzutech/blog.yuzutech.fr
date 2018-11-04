const fs = require('fs')
const path = require('path')

const sass = require('node-sass')
const chokidar = require('chokidar')
const browserSync = require("browser-sync")

browserSync({server: "./public"});

const processor = require('./modules/processor')
processor.init()
const index = require('./modules/index')

const watcher = chokidar.watch(['src/pages/**.adoc', 'src/stylesheets/**.scss', 'src/stylesheets/**.css', 'src/images/**', 'src/javascripts/**'], {
  persistent: true
})

function update (filePath) {
  if (filePath.includes('stylesheets')) {
    const dir = 'public/stylesheets'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    if (filePath.endsWith('.scss')) {
      const outFile = `public/stylesheets/${path.basename(filePath, '.scss')}.css`
      const sourceMap = `public/stylesheets/${path.basename(filePath, '.scss')}.css.map`
      try {
        const result = sass.renderSync({
          file: filePath,
          data: fs.readFileSync(filePath, 'utf-8'),
          outFile: outFile,
          includePaths: [
            'node_modules/bulma'
          ],
          outputStyle: 'compact',
          sourceMap: true
        })
        fs.writeFileSync(outFile, result.css)
        if (result.map) {
          fs.writeFileSync(sourceMap, result.map)
        }

        browserSync.reload(`stylesheets/${path.basename(filePath, '.scss')}.css`);
      } catch (e) {
        console.error(`Unable to compile ${path.basename(filePath)}, skipping.`, e);
      }
    } else {
      fs.writeFileSync(`public/stylesheets/${path.basename(filePath)}`, fs.readFileSync(filePath, 'utf-8'), 'utf-8')
      browserSync.reload(`stylesheets/${path.basename(filePath)}`);
    }
  } else if (filePath.includes('pages')) {
    processor.convert(filePath)
    index.generate(processor)
    browserSync.reload(`${path.basename(filePath)}`)
    browserSync.reload('index.html')
  } else if (filePath.includes('images')) {
    const dir = 'public/images'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
      fs.writeFileSync(`public/images/${path.basename(filePath)}`, fs.readFileSync(filePath, 'binary'), 'binary')
    } else if (filePath.endsWith('.ico')) {
      fs.writeFileSync(`public/${path.basename(filePath)}`, fs.readFileSync(filePath, 'binary'), 'binary')
    }
    browserSync.reload();
  } else if (filePath.includes('javascripts')) {
    const dir = 'public/javascripts'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    fs.writeFileSync(`public/javascripts/${path.basename(filePath)}`, fs.readFileSync(filePath, 'utf-8'), 'utf-8')
    browserSync.reload(`javascripts/${path.basename(filePath)}`);
  }
}

watcher
  .on('add', filePath => {
    console.log(`File ${filePath} has been added`)
    update(filePath)
  })
  .on('change', filePath => {
    console.log(`File ${filePath} has been changed`)
    update(filePath)
  });
