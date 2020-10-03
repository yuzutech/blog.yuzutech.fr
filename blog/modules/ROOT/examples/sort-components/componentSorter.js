'use strict'

module.exports = (components, sortOrder = undefined) => {
  if (sortOrder) {
    components = Object.assign({}, components)
    sortOrder = sortOrder.split(',').map((componentName) => componentName.trim())

    let restIdx
    let i = 0
    const sortedComponents = sortOrder.reduce((accum, name) => {
      if (name === '*') {
        restIdx = i
      } else if (name.startsWith('!')) {
        if ((name = name.slice(1)) in components) {
          delete components[name]
        } else {
          console.log(`no such component to omit named: ${name}`)
        }
      } else if (name in components) {
        i++
        accum.push(components[name])
        delete components[name]
      } else {
        console.log(`no such component named: ${name}`)
      }
      return accum
    }, [])
    if (restIdx !== undefined) {
      sortedComponents.splice(restIdx, 0, ...Object.values(components))
    } else if (Object.keys(components).length) {
      console.log(`Components ${Object.keys(components).join(', ')} not ordered or hidden`)
    }
    return sortedComponents
  } else {
    return components
  }
}
