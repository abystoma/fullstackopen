# Component state, event handlers

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```
# Component helper functions

Let's expand our Hello component so that it guesses the year of birth of the person being greeted:

```js
const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )

```

- The logic for guessing the year of birth is separated into a function of its own that is called when the component is rendered.

- The person's age does not have to be passed as a parameter to the function, since it can directly access all props that are passed to the component.

# Destructuring

props is an object

```js
props = {
  name: 'Arto Hellas',
  age: 35,
}
```

we can streamline our component by assigning the values of the properties directly into two variables name and age which we can then use in our code:

```js
const Hello = (props) => {
  const name = props.name
  const age = props.age

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

To recap, the two function definitions shown below are equivalent:

```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```
Destructuring makes the assignment of variables even easier, since we can use it to extract and gather the values of an object's properties into separate variables:

```js
const Hello = (props) => {
  const { name, age } = props
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

# Page re-rendering

So far all of our applications have been such that their appearance remains the same after the initial rendering. What if we wanted to create a counter where the value increased as a function of time or at the click of a button?

`App.js`

```js
const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
```

`index.js`
```js
import ReactDOM from 'react-dom'
import App from './App'

let counter = 1

const refresh = () => {
  ReactDOM.render(<App counter={counter} />, 
  document.getElementById('root'))
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```
Now the component renders three times, first with the value 1, then 2, and finally 3. However, the values 1 and 2 are displayed on the screen for such a short amount of time that they can't be noticed.

We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using setInterval:

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```

Making repeated calls to the `ReactDOM.render` method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect.

## Stateful component
All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.

Next, let's add state to our application's App component with the help of React's state hook.

`index.js`

```js
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, 
document.getElementById('root'))
```

`App.js`

```js
import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}

export default App
```

- In the first row, the file imports the useState function
- The function body that defines the component begins with the function call: `const [ counter, setCounter ] = useState(0)` 
- The function call adds state to the component and renders it initialized with the value of zero. 
- The function returns an array that contains two items. We assign the items to the variables `counter` and `setCounter` by using the destructuring assignment syntax shown earlier.

The counter variable is assigned the initial value of state which is zero. The variable setCounter is assigned to a function that will be used to modify the state.

When the state modifying function setCounter is called, React re-renders the component which means that the function body of the component function gets re-executed:

```js
() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
```

- The second time the component function is executed it calls the `useState` function and returns the new value of the state: 1. 
- Executing the function body again also makes a new function call to `setTimeout`, which executes the one second timeout and increments the `counter` state again. 
- Because the value of the `counter` variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of `counter` to 2. `() => setCounter(2)`

Meanwhile, the old value of `counter` - "1" - is rendered to the screen.

Every time the `setCounter` modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.


## Event handling

A user's interaction with the different elements of a web page can cause a collection of various different kinds of events to be triggered.

Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the button element.

Button elements support so-called mouse events, of which click is the most common event. The click event on a button can also be triggered with the keyboard or a touch screen despite the name mouse event.

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```

We set the value of the button's onClick attribute to be a reference to the `handleClick` function defined in the code.

Now every click of the plus button causes the handleClick function to be called, meaning that every click event will log a clicked message to the browser console.

The event handler function can also be defined directly in the value assignment of the onClick-attribute:


```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => console.log('clicked')}>
        plus
      </button>
    </div>
  )
}
```
Let's also add a button for resetting the counter:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(0)}> 
        zero
      </button>
    </div>
  )
}
```
## Event handler is a function

We define the event handlers for our buttons where we declare their onClick attributes:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

What if we tried to define the event handlers in a simpler form?

```js
<button onClick={setCounter(counter + 1)}> 
  plus
</button>
```

This would completely break our application:

![image](https://i.imgur.com/9PQyKEX.png)

What's going on? An event handler is supposed to be either a function or a function reference, and when we write:

```js
<button onClick={setCounter(counter + 1)}>
```
the event handler is actually a function call. 

- In many situations this is ok, but not in this particular situation. 
- In the beginning the value of the counter variable is 0. 
- When React renders the component for the first time, it executes the function call `setCounter(0+1)`, and changes the value of the component's state to 1. 
- This will cause the component to be re-rendered, React will execute the setCounter function call again, and the state will change leading to another rerender...

Let's define the event handlers like we did before:

```js
<button onClick={() => setCounter(counter + 1)}> 
  plus
</button>
```

Now the button's attribute which defines what happens when the button is clicked - onClick - has the value `() => setCounter(counter + 1)`. The setCounter function is called only when a user clicks the button.

Usually defining event handlers within JSX-templates is not a good idea. Here it's ok, because our event handlers are so simple.

Let's separate the event handlers into separate functions anyway:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  )
}
```
## Passing state to child components

It's recommended to write React components that are small and reusable across the application and even across projects. Let's refactor our application so that it's composed of three smaller components, one component for displaying the counter and two components for buttons.

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <Button
        onClick={increaseByOne}
        text='plus'
      />
      <Button
        onClick={setToZero}
        text='zero'
      />     
      <Button
        onClick={decreaseByOne}
        text='minus'
      />           
    </div>
  )
}
```

Since we now have an easily reusable Button component, we've also implemented new functionality into our application by adding a button that can be used to decrement the counter.

## Changes in state cause rerendering

Let's go over the main principles of how an application works once more.

- When the application starts, the code in `App` is executed. 
- This code uses a useState hook to create the application state, setting an initial value of the variable `counter`. 
- This component contains the `Display` component - which displays the counter's value, 0 - and three `Button` components. 
- The buttons all have event handlers, which are used to change the state of the counter.



When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the `App` component with the `setCounter` function. 

**Calling a function which changes the state causes the component to rerender.**

So, if a user clicks the plus button, the button's event handler changes the value of `counter` to 1, and the `App` component is rerendered. This causes its subcomponents `Display` and `Button` to also be re-rendered. `Display` receives the new value of the counter, 1, as props. The `Button` components receive event handlers which can be used to change the state of the counter.