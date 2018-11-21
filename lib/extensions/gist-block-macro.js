function gistBlockMacro () {
  const self = this;
  self.named('gist')
  self.process(function (parent, target, attrs) {
    const titleHTML = attrs.title ? `<div class="title">${attrs.title}</div>\n` : ''
    const html = `<div class="openblock gist">
  ${titleHTML}<div class="content">
    <script src="https://gist.github.com/${target}.js"></script>
  </div>
</div>`
    return self.createBlock(parent, 'pass', html, attrs, {})
  })
}

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(gistBlockMacro)
    })
  } else if (typeof registry.block === 'function') {
    registry.blockMacro(gistBlockMacro)
  }
  return registry
}
