require('console.table')

const f = (x) => Math.cos(2*x) + (x + 1) ** 3 + 6
const fp = (x) => -2 * Math.sin(2 * x) + 3 * ((x + 1) ** 2)
const fpp = (x) => -4 * Math.cos(2 * x) + 6 * (x + 1)
 
function print (result) {
  const resultForPrint = result.map((r) => ({
    'n + 1': r.nplus,
    'xn': r.xnp,
    'x(n + 1)': r.xn,
    '|xn - x(n+1)|': r.first,
    '|f(xn + 1)|': r.second
  }))

  console.table(resultForPrint)
}

function simple (x0, eps) {
  const result = []

  let xn = x0
  let i = 1
  console.log(`Метод простых итераций, погрешность ${eps}`)

  do {
    xnp = xn
    xn = xnp - 0.05 * f(xnp)

    result.push({
      nplus: i++,
      xnp,
      xn,
      first: Math.abs(xn - xnp),
      second: Math.abs(f(xn))
    })
  } while (Math.abs(xn - xnp) > eps || Math.abs(f(xn)) > eps)

  print(result)
  console.log('\n')
}

function validForNeuton (x0) {
  return f(x0) * fpp(x0) > 0
}

function neuton (x0, eps) {
  const result = []

  let xn = x0
  let i = 1
  console.log(`Метод Ньютона, погрешность ${eps}`)

  if (!validForNeuton(x0)) {
    console.log('Не выполняется достаточное условие сходимости метода Ньютона!\n')
    return
  }

  do {
    xnp = xn
    xn = xnp - f(xnp)/fp(xnp)

    result.push({
      nplus: i++,
      xnp,
      xn,
      first: Math.abs(xn - xnp),
      second: Math.abs(f(xn))
    })
  } while (Math.abs(xn - xnp) > eps || Math.abs(f(xn)) > eps)

  print(result)
  console.log('\n')
}

function modifiedNeuton (x0, eps) {
  const result = []

  let xn = x0
  let i = 1
  let fp0 = fp(xn)
  console.log(`Модифицированный метод Ньютона, погрешность ${eps}`)

  if (!validForNeuton(x0)) {
    console.log('Не выполняется достаточное условие сходимости модифицированного метода Ньютона!\n')
    return
  }

  do {
    xnp = xn
    xn = xnp - f(xnp)/fp0

    result.push({
      nplus: i++,
      xnp,
      xn,
      first: Math.abs(xn - xnp),
      second: Math.abs(f(xn))
    })
  } while (Math.abs(xn - xnp) > eps || Math.abs(f(xn)) > eps)

  print(result)
  console.log('\n')
}

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('Ответ с wolframalpha: -2.9026731286871851549')

rl.question('Введите x0 через пробел:\n', (answer) => {
  const [x0] = answer.split(' ').map((a) => Number(a))

  console.log('\n')

  simple(x0, 0.001)
  neuton(x0, 0.001)
  modifiedNeuton(x0, 0.001)

  simple(x0, 0.00001)
  neuton(x0, 0.00001)
  modifiedNeuton(x0, 0.00001)

  rl.close()
})
