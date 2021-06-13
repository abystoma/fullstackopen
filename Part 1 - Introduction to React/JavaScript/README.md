# Arrays

When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of immutable data structures. In React code, it is preferable to use the method concat, which does not add the item to the array, but creates a new array in which the content of the old array and the new item are both included. <br>

The method call `t.concat(5)` does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item.

