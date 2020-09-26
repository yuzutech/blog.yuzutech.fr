'use strict'

const VERSION_SORT_KEY = 'version-sort-key'

module.exports = (what, data, sortOrder = undefined) => {
  if (what === 'components') {
    return sortComponents(data, sortOrder)
  } else if (what === 'versions') {
    return sortVersions(data)
  } else {
    throw new Error(`unexpected sort request: ${what}. Expected 'components' or 'versions`)
  }
}

function sortComponents (components, sortOrder = undefined) {
  if (sortOrder) {
    components = Object.assign({}, components)
    sortOrder = sortOrder.split(',').map((componentName) => componentName.trim())

    let restIdx
    let i = 0
    let omitAll
    const sortedComponents = sortOrder.reduce((accum, name) => {
      let ignoreIfMissing = name.endsWith('?')
      ignoreIfMissing && (name = name.slice(0, name.length - 2))
      if (name === '*') {
        restIdx = i
      } else if (name === '!*') {
        omitAll = true
      } else if (name.startsWith('!')) {
        if ((name = name.slice(1)) in components) {
          delete components[name]
        } else {
          ignoreIfMissing || console.log(`no such component to omit named: ${name}`)
        }
      } else if (name in components) {
        i++
        accum.push(components[name])
        delete components[name]
      } else {
        ignoreIfMissing || console.log(`no such component named: ${name}`)
      }
      return accum
    }, [])
    if (restIdx !== undefined) {
      sortedComponents.splice(restIdx, 0, ...Object.values(components))
    } else if (Object.keys(components).length) {
      omitAll || console.log(`Components ${Object.keys(components).join(', ')} not ordered or hidden`)
    }
    return sortComponentVersions(sortedComponents)
  } else {
    return sortComponentVersions(Object.values(components))
  }
}

function sortComponentVersions (components) {
  return components.map((component) => {
    component = Object.assign({ name: component.name, title: component.title }, component)
    component.versions = sortVersions(component.versions)
    return component
  })
}

function sortVersions (versions) {
  const sortedVersions = (versions || []).slice()
    .filter((v) => v.asciidoc.attributes[VERSION_SORT_KEY] !== '!')
    .sort((v1, v2) => {
      const k1 = v1.asciidoc.attributes[VERSION_SORT_KEY]
      const k2 = v2.asciidoc.attributes[VERSION_SORT_KEY]
      if (k1) {
        if (k2) {
          return k2.localeCompare(k1)
        }
        return -1
      }
      if (k2) return 1
      return versions.indexOf(v1) - versions.indexOf(v2)
    })
  return sortedVersions
}
