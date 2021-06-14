## Arrays

When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of immutable data structures. In React code, it is preferable to use the method concat, which does not add the item to the array, but creates a new array in which the content of the old array and the new item are both included. <br>

The method call `t.concat(5)` does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item.

## Objects
   ```js
   object1['secret number'] = 12341
   ``` 
Using brackets, because when using dot notation, secret number is not a valid property name because of the space character.

## Functions
1. ```js
   const square = p => p * p
   ```
   If the function only contains a single expression then the braces are not needed. In this case the function only returns the result of its only expression. 
2. ```js
   const t = [1, 2, 3]
   const tSquared = t.map(p => p * p)
   // tSquared is now [1, 4, 9]
   ```
   This form is particularly handy when manipulating array

## Function declaration

There are two ways by which the function can be referenced: 
1. Function declaration
   ```js
   function product(a, b) {
      return a * b
   }
   const result = product(2, 6)
   // result is now 12
   ```
2. Function expression
   ```js
    const average = function(a, b) {
    return (a + b) / 2
    }

    const result = average(2, 5)
    // result is now 3.5
   ```
The arrow function feature was added to JavaScript only a couple of years ago, with version ES6.

## Object methods and "this"

```js
arto.greet()       // "hello, my name is Arto Hellas" gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"
```
When calling the method through a reference, the method loses knowledge of what was the original this.



