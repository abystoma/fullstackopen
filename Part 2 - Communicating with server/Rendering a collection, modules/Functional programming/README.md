## Higher order function
Filter accepts one argument, another function. Functions like this, functions that you send to other functions are called callback functions because the host function will callback to them.

Filter will loop through each item in the array and for each item it is going to pass it into the callback functions and when it does it will expect the call back function to return either true or false to tell filter whether  or not this item should be in the new array and after its done it will return the new filtered array.

## Map
Map will take a callback function,the call back function will be passed each items in the animals array
map will include all items in the array but instead it expects the call back function to return a transformed object that it will put into the new array instead of the original animal

Since map just expects the callback to return any object we can use it to create completely new objects.

## Reduce basics
Reduce is the multi tool of list transformation, it can be used to express any list transformation infact you can use reduce to implement functions like map, filter and so on.
