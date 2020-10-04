const Benchmark = require('benchmark')

const bench = new Benchmark('splice', () => {
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].splice(0, 1)
})
console.log(bench.run().toString())
