require('console.table')
const readline = require('readline')

function factorial (n) {
  if (n == 0 || n == 1) {
    return 1
  }

  return factorial(n-1) * n
}

function initialFunc (x) {
  return Math.sin(x) / (3 + Math.cos(x))
}

function initialFuncDifferential (x) {
  return (3*Math.cos(x) + 1) / ((3 + Math.cos(x)) ** 2)
}

function p1 (x) {
  const q = (x - 9) / 0.02
  
  return 0.197293
    - 0.008033 * q
    - 0.00027 * (q * (q - 1) / factorial(2))
    + 0.000206 * (q * (q - 1) * (q - 2) / factorial(3))
    - 0.000302 * (q * (q - 1) * (q - 2) * (q - 3) / factorial(4))
    + 0.000488 * (q * (q - 1) * (q - 2) * (q - 3) * (q - 4) / factorial(5))
}

function p2 (x) {
  const q = (x - 9.1) / 0.02

  return 0.155485
    - 0.008678 * q
    - 0.000151 * (q * (q + 1) / factorial(2))
    + 0.000009 * (q * (q + 1) * (q + 2) / factorial(3))
    + 0.000186 * (q * (q + 1) * (q + 2) * (q + 3) / factorial(4))
    + 0.000488 * (q * (q + 1) * (q + 2) * (q + 3) * (q + 4) / factorial(5))
}

function lagranzh (x) {
  const c0 = 0.1973 / (-0.02 * -0.04 * -0.06 * -0.08 * -0.1)
  const c1 = 0.1893 / (0.02 * -0.02 * -0.04 * -0.06 * -0.08)
  const c2 = 0.1811 / (0.04 * 0.02 * -0.02 * -0.04 * -0.06)
  const c3 = 0.1727 / (0.06 * 0.04 * 0.02 * -0.02 * -0.04)
  const c4 = 0.1642 / (0.08 * 0.06 * 0.04 * 0.02 * -0.02)
  const c5 = 0.1559 / (0.1 * 0.08 * 0.06 * 0.04 * 0.02)
  
  const x0 = 9
  const x1 = 9.02
  const x2 = 9.04
  const x3 = 9.06
  const x4 = 9.08
  const x5 = 9.1

  return c0 * (x - x1) * (x - x2) * (x - x3) * (x - x4) * (x - x5)
    + c1 * (x - x0) * (x - x2) * (x - x3) * (x - x4) * (x - x5)
    + c2 * (x - x0) * (x - x1) * (x - x3) * (x - x4) * (x - x5)
    + c3 * (x - x0) * (x - x1) * (x - x2)* (x - x4) * (x - x5)
    + c4 * (x - x0) * (x - x1) * (x - x2) * (x - x3) * (x - x5)
    + c5 * (x - x0) * (x - x1) * (x - x2) * (x - x3) * (x - x4)
}

function getNearest1 (x) {
  const arr = [9, 9.02, 9.04, 9.06, 9.08, 9.1]
  const h = 0.02
  const p = Math.pow(10, -10)
  let i = 0
  while (i <= 5) {
    if (Math.abs(x - arr[i]) <= h/2 + p) {
      return arr[i]
    }
    i++;
  }

  return arr[0]
}

function getNearest2 (x) {
  const arr = [9, 9.02, 9.04, 9.06, 9.08, 9.1]
  const h = 0.02
  const p = Math.pow(10, -10)
  let i = 5
  while (i >= 0) {
    if (Math.abs(x - arr[i]) <= h/2 + p) {
      return arr[i]
    }
    i--;
  }

  return arr[5]
}

function p1d (x) {
  const q = (x - getNearest1(x)) / 0.02

  return 1 / 0.02 * (
    -0.008033
    -(2 * q - 1) / factorial(2) * 0.00027
    +(3 * q**2 - 6 * q + 2) / factorial(3) * 0.000206
    -0.000302 * (4 * q**3 - 18 * q**2 + 22*q - 6) / factorial(4)
    +0.000488 * (5 * q**4 - 40 * q**3 + 105 * q**2 - 100 * q + 24) / factorial(5)
  )
}

function p2d (x) {
  const q = (x - getNearest2(x)) / 0.02

  return 1 / 0.02 * (
    -0.008678
    -(2 * q + 1) / factorial(2) * 0.000151
    +(3 * q**2 + 6 * q + 2) / factorial(3) * 0.000009
    +0.000186 * (4 * q**3 + 18 * q**2 + 22*q - 6) / factorial(4)
    +0.000488 * (5 * q**4 + 40 * q**3 + 105 * q**2 + 100 * q + 24) / factorial(5)
  )
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Введите x1, x2, x3 через пробел: ', (ans) => {
  const numbers = ans.split(' ').map((f) => Number(f))

  let results = []

  numbers.forEach((n) => {
    const y = initialFunc(n)

    const p1res = p1(n)
    const p1Diff = Math.abs(p1res - y)

    const p2res = p2(n)
    const p2Diff = Math.abs(p2res - y)

    const lagRes = lagranzh(n)
    const lagDiff = Math.abs(lagRes - y)

    const yd = initialFuncDifferential(n)

    const p1dRes = p1d(n)
    const p1dDiff = Math.abs(p1dRes - yd)

    const p2dRes = p2d(n)
    const p2dDiff = Math.abs(p2dRes - yd)

    results.push({
      x: n,
      y,
      p1res,
      p1Diff,
      p2res,
      p2Diff,
      lagRes,
      lagDiff,
      yd,
      p1dRes,
      p1dDiff,
      p2dRes,
      p2dDiff
    })
  })

  const p1Results = results.map((r) => ({
    x: r.x,
    y: r.y,
    'p1': r.p1res,
    'diff': r.p1Diff
  }))
  console.log('Первая интерполяционная формула Ньютона')
  console.table(p1Results)

  const p2Results = results.map((r) => ({
    x: r.x,
    y: r.y,
    'p2': r.p2res,
    'diff': r.p2Diff
  }))
  console.log('Вторая интерполяционная формула Ньютона')
  console.table(p2Results)

  const lagResults = results.map((r) => ({
    x: r.x,
    y: r.y,
    'p1': r.lagRes,
    'diff': r.lagDiff
  }))
  console.log('Интерполяционная формула Лагранжа')
  console.table(lagResults)

  const p1dResults = results.map((r) => ({
    x: r.x,
    "y'": r.yd,
    "p1'": r.p1dRes,
    "x0": getNearest1(r.x),
    'diff': r.p1dDiff
  }))
  console.log('Численное дифференцирование, основанное на I ИФН')
  console.table(p1dResults)

  const p2dResults = results.map((r) => ({
    x: r.x,
    "y'": r.yd,
    "p2'": r.p2dRes,
    "xn": getNearest2(r.x),
    'diff': r.p2dDiff
  }))
  console.log('Численное дифференцирование, основанное на II ИФН')
  console.table(p2dResults)
})

