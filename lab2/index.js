require('console.table')
const readline = require('readline')

function mpi ({ x, y, z }) {
  return {
    x: -1/4 + 1/4*y + 1/4*z,
    y: -1/6 + 1/6*x + 2/3*z,
    z: 2 + 1/5*x + 2/5*y
  }
}

function zeidel ({ x, y, z }) {
  const newX = -1/4 + 1/4*y + 1/4*z
  const newY = -1/6 + 1/6*newX + 2/3*z
  const newZ = 2 + 1/5*newX + 2/5*newY

  return {
    x: newX,
    y: newY,
    z: newZ
  }
}

function getIterationEps (ans1, ans2) {
  return Math.abs(ans2.x - ans1.x) + Math.abs(ans2.y - ans1.y) + Math.abs(ans2.z - ans1.z)
}

function performIterationMethod (initialValues, eps, method) {
  let ans1 = Object.assign({}, initialValues)
  let ans2 = method(ans1)

  let results = []

  let i = 1
  while (getIterationEps(ans1, ans2) > eps) {
    results.push({
      index: i,
      ...ans1,
      eps: getIterationEps(ans1, ans2),
    })
    i++;
    
    ans1 = ans2
    ans2 = method(ans1)
  }
  results.push({
    index: i,
    ...ans2,
    eps: getIterationEps(ans1, ans2)
  })

  return results
}

function getRelaxRs ({ x, y, z }) {
  return {
    x: -x + 1/4*y + 1/4*z - 1/4,
    y: 1/6*x -y + 2/3*z - 1/6,
    z: 1/5*x + 2/5*y - z + 2
  }
}

function relaxMethod (ans) {
  let r = getRelaxRs(ans)

  let maxRValue = r.x
  let maxRKey = 'x'

  Object.keys(r).forEach((key) => {
    const possibleMax = Math.abs(r[key])
    if (possibleMax > maxRValue) {
      maxRValue = possibleMax
      maxRKey = key
    }
  })

  const result = Object.assign({}, ans)
  result[maxRKey] += r[maxRKey]

  return result
}

function shouldRelaxMethodEnd (ans, eps) {
  let result = true
  const rs = getRelaxRs(ans)

  Object.values(rs).forEach((r) => {
    if (Math.abs(r) > eps) {
      result = false
    }
  })

  return result
}

function performRelaxMethod (initialValues, eps) {
  let ans1 = Object.assign({}, initialValues)
  let ans2 = relaxMethod(ans1)

  let results = []

  let i = 1
  while (shouldRelaxMethodEnd(ans2, eps) !== true) {
    const rs = getRelaxRs(ans1)
    results.push({
      index: i,
      ...ans1,
      rx: rs.x,
      ry: rs.y,
      rz: rs.z
    })
    i++
    
    ans1 = ans2
    ans2 = relaxMethod(ans1)
  }
  const rs = getRelaxRs(ans2)
  results.push({
    index: i,
    ...ans2,
    rx: rs.x,
    ry: rs.y,
    rz: rs.z
  })

  return results
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Введите начальные значения через пробел: ', (ans) => {
  const [x, y, z] = ans.split(' ').map((n) => Number(n))
  const initialValues = { x, y, z }

  const epsilons = [0.001, 0.00001]
  epsilons.forEach((eps) => {
    console.log(`======= EPS = ${eps}  =======`)

    const mpiResult = performIterationMethod(initialValues, Number(eps), mpi)
    console.log('Метод простых итераций')
    console.table(mpiResult)
    console.log('Количество итераций: ', mpiResult.length)

    console.log('')

    const zeidelResult = performIterationMethod(initialValues, Number(eps), zeidel)
    console.log('Метод Зейделя')
    console.table(zeidelResult)
    console.log('Количество итераций: ', zeidelResult.length)

    console.log('')
    
    const relaxResult = performRelaxMethod(initialValues, Number(eps))
    console.log('Метод Релаксации')
    console.table(relaxResult)
    console.log('Количество итераций: ', relaxResult.length)

    console.log('')
  })
})
