const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}

const square = p => {
  console.log(p)
  return p * p
}

const result = sum(1, 5)
const power = square(2)

console.log(result)
console.log(power)