// tag::library[]
const library = require('@fortawesome/fontawesome-svg-core').library;
const fas = require('@fortawesome/free-solid-svg-icons').fas
const far = require('@fortawesome/free-regular-svg-icons').far
const fab = require('@fortawesome/free-brands-svg-icons').fab
library.add(fas, far, fab)
// end::library[]

// tag::icon[]
const icon = require('@fortawesome/fontawesome-svg-core').icon
const flaskIcon = icon({ iconName: 'flask' })
console.log(flaskIcon) // { type: 'icon', prefix: 'fa',  iconName: 'flask',  icon: [...] }
console.log(flaskIcon.html) // [ '<svg...><path ...></path></svg>' ]
// end::icon[]

// tag::icon-brand[]
console.log(icon({ iconName: 'gitlab' })) // undefined
console.log(icon({ prefix: 'fab', iconName: 'gitlab' })) // { type: 'icon', prefix: 'fab',  iconName: 'gitlab',  icon: [...] }
// end::icon-brand[]

// tag::icon-multi[]
console.log(icon({ prefix: 'far', iconName: 'address-book' })) // { type: 'icon', prefix: 'far',  iconName: 'address-book',  icon: [...] }
console.log(icon({ prefix: 'fas', iconName: 'address-book' })) // { type: 'icon', prefix: 'fas',  iconName: 'address-book',  icon: [...] }
// end::icon-multi[]

// tag::icon-undef[]
console.log(icon({ iconName: '404' })) // undefined
// end::icon-undef[]
