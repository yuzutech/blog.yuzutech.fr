const chokidar = require('chokidar')
const browserSync = require("browser-sync")
const generator = require('./lib/generator.js')
const Lock = require('./lock.js')
const processorLock = new Lock()

const antoraArgs = ['--playbook', 'site.yml']

browserSync({server: "./public"})

const watcher = chokidar.watch(['blog/modules/ROOT/**'],
  {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  }
)

async function process() {
  try {
    const hasQueuedEvents = await processorLock.acquire()
    if (!hasQueuedEvents) {
      await generator(antoraArgs, process.env)
      browserSync.reload("*")
    }
  } catch (err) {
    console.error(err)
  } finally {
    processorLock.release()
  }
}

watcher.on('change', async _ => await process())
watcher.on('unlink', async _ => await process())

process()
