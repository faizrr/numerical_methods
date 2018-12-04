require('console.table')
const range = require('lodash/range')

const A = Math.PI / 6
const B = Math.PI / 4

function f (x) {
  return x * Math.cos(2 * x**2)
}

function newton () {
  return 1/4 * (Math.sin(Math.PI ** 2 / 8) - Math.sin(Math.PI ** 2 / 18))
}

function trapeze (k) {
  const h = (B - A) / k
  const y = range(k + 1).map((r) => {
    const x = A + r * h
    return f(x)
  })

  const s = range(1, k).reduce((sum, r) => {
    return sum + y[r]
  }, 0)

  return h / 2 * (y[0] + y[k] + 2 * s)
}

function simpson (k) {
  const h = (B - A) / k
  const y = range(k + 1).map((r) => {
    const x = A + r * h
    return f(x)
  })

  const s1 = range(1, k, 2).reduce((sum, r) => {
    return sum + y[r]
  }, 0)
  const s2 = range(2, k - 1, 2).reduce((sum, r) => {
    return sum + y[r]
  }, 0)

  return h / 3 * (y[0] + y[k] + 4*s1 + 2*s2)
}

function gauss (ts, as) {
  const xs = ts.map((t) => (
    (B + A)/2 + (B - A)/2 * t
  ))

  const s = as.reduce((sum, a, index) => {
    return sum + a * f(xs[index])
  }, 0)

  return (B - A) / 2 * s
}

function gauss4 () {
  const t = [
    -0.8611361,
    -0.33998104,
    0.33998104,
    0.8611361
  ]
  const a = [
    0.34785484,
    0.65214516,
    0.65214516,
    0.34785484
  ]

  return gauss(t, a)
}

function gauss8 () {
  const t = [
    -0.96028986,
    -0.79666648,
    -0.52553242,
    -0.18343464,
    0.18343464,
    0.52553242,
    0.79666648,
    0.96028986
  ]
  const a = [
    0.10122854,
    0.22238104,
    0.31370664,
    0.362683378,
    0.362683378,
    0.31370664,
    0.22238104,
    0.10122854,
  ]
  
  return gauss(t, a)
}

console.log("Метод Ньютона:")
const newtonResult = newton()
console.log(newtonResult)
console.log('')

console.log("Формула трапеций:")
const t4 = trapeze(4)
const t8 = trapeze(8)
const dt4 = Math.abs(newtonResult - t4)
const dt8 = Math.abs(newtonResult - t8)
console.table([
  { n: 4, y: t4, delta: dt4 },
  { n: 8, y: t8, delta: dt8 },
])

console.log("Квадратурная формула Симпсона:")
const s4 = simpson(4)
const s8 = simpson(8)
const ds4 = Math.abs(newtonResult - s4)
const ds8 = Math.abs(newtonResult - s8)
console.table([
  { n: 4, y: s4, delta: ds4 },
  { n: 8, y: s8, delta: ds8 },
])

console.log("Квадратурная формула Гаусса:")
const g4 = gauss4()
const g8 = gauss8()
const dg4 = Math.abs(newtonResult - g4)
const dg8 = Math.abs(newtonResult - g8)
console.table([
  { n: 4, y: g4, delta: dg4 },
  { n: 8, y: g8, delta: dg8 },
])

