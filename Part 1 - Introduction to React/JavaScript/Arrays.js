const t = [1, -1, 3]

t.push(5)
const t2 = t.concat(5)

console.log(t.length) // 4 is printed

console.log(t[1])     // -1 is printed

console.log(t)  // [1, -1, 3] is printed

console.log(t2) // [1, -1, 3, 5] is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})  

