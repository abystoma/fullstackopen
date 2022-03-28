# A more complex state, debugging React apps

## Complex state

In our previous example the application state was simple as it was comprised of a single integer. What if our application requires a more complex state?

In most cases the easiest and best way to accomplish this is by using the useState function multiple times to create separate "pieces" of state.

1. In the following code two pieces of state for the application named left and right that both get the initial value of 0

    ```js
    const App = () => {
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)

    return (
        <div>
        {left}
        <button onClick={() => setLeft(left + 1)}>
            left
        </button>
        <button onClick={() => setRight(right + 1)}>
            right
        </button>
        {right}
        </div>
    )
    }
    ```
    The component gets access to the functions `setLeft` and `setRight` that it can use to update the two pieces of state.

2. We can make the code more efficient by using only one state.

    ```js
    const App = () => {
    const [clicks, setClicks] = useState({
        left: 0, right: 0
    })

    const handleLeftClick = () => {
        const newClicks = { 
        left: clicks.left + 1, 
        right: clicks.right 
        }
        setClicks(newClicks)
    }

    const handleRightClick = () => {
        const newClicks = { 
        left: clicks.left, 
        right: clicks.right + 1 
        }
        setClicks(newClicks)
    }

    return (
        <div>
        {clicks.left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {clicks.right}
        </div>
    )
    }
    ```

    Now the component only has a single piece of state and the event handlers have to take care of changing the entire application state.

3. We can define the new state object a bit more neatly by using the object spread syntax

    ```js
    const handleLeftClick = () => {
    const newClicks = { 
        ...clicks, 
        left: clicks.left + 1 
    }
    setClicks(newClicks)
    }

    const handleRightClick = () => {
    const newClicks = { 
        ...clicks, 
        right: clicks.right + 1 
    }
    setClicks(newClicks)
    }
    ```
    `{ ...clicks }` creates a new object that has copies of all of the properties of the `clicks` object. When we specify a particular property - e.g. right in `{ ...clicks, right: 1 }`, the value of the `right` property in the new object will be 1.

    In the example above, this:

    ```js
    { ...clicks, right: clicks.right + 1 }
    ```

    creates a copy of the clicks object where the value of the right property is increased by one.

    Assigning the object to a variable in the event handlers is not necessary and we can simplify the functions to the following form:

    ```js
    const handleLeftClick = () =>
    setClicks({ ...clicks, left: clicks.left + 1 })

    const handleRightClick = () =>
    setClicks({ ...clicks, right: clicks.right + 1 })
    ```

    Some readers might be wondering why we didn't just update the state directly, like this:

    ```js
    const handleLeftClick = () => {
    clicks.left++
    setClicks(clicks)
    }
    ```
    - The application appears to work. However, it is forbidden in React to mutate state directly, since it can result in unexpected side effects. 
    - Changing state has to always be done by setting the state to a new object. 
    - If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object, and setting that as the new state.

    Storing all of the state in a single state object is a bad choice for this particular application; there's no apparent benefit and the resulting application is a lot more complex. In this case storing the click counters into separate pieces of state is a far more suitable choice.

## Handling arrays

Let's add a piece of state to our application containing an array allClicks that remembers every click that has occurred in the application.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
```
## Conditional rendering

Let's modify our application so that the rendering of the clicking history is handled by a new History component:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

Now the behavior of the component depends on whether or not any buttons have been clicked. If not, meaning that the allClicks array is empty, the component renders a div element with some instructions instead:

Let's make one last modification to our application by refactoring it to use the `Button` component that we defined earlier on:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```
## Debugging React applications

React is an extremely developer-friendly library when it comes to debugging.

**The first rule of web development**
**Keep the browser's developer console open at all times.**

The *Console tab* in particular should always be open, unless there is a specific reason to view another tab.

Old school, print-based debugging is always a good idea. If the component is not working as intended, it's useful to start printing its variables out to the console. 

Logging to the console is by no means the only way of debugging our applications. You can pause the execution of your application code in the Chrome developer console's debugger, by writing the command debugger anywhere in your code.

The execution will pause once it arrives at a point where the debugger command gets executed:

![image](https://i.imgur.com/lzXbcnG.png)

By going to the Console tab, it is easy to inspect the current state of variables.

The debugger also enables us to execute our code line by line with the controls found on the right-hand side of the Sources tab.

You can also access the debugger without the `debugger` command by adding breakpoints in the Sources tab. Inspecting the values of the component's variables can be done in the Scope-section:

![image](https://i.imgur.com/G72XREc.png)

It is highly recommended to add the React developer tools extension to Chrome. It adds a new Components tab to the developer tools. The new developer tools tab can be used to inspect the different React elements in the application, along with their state and props.



## Rules of Hooks

The `useState` function (as well as the `useEffect` function introduced later on in the course) must not be called from inside of a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.


Hooks may only be called from the inside of a function body that defines a React component.
```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```
## Event Handling Revisited

Let's assume that we're developing this simple application with the following component `App`:

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

We want the clicking of the button to reset the state stored in the `value` variable.

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

## Function that returns a function

 Another way to define an event handler is to use function that returns a function.

Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const hello = () => {
    const handler = () => console.log('hello world')
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

The code functions correctly even though it looks complicated.

The event handler is now set to a function call:

```js
<button onClick={hello()}>button</button>
```

When the component is rendered, the following function gets executed:

```js
const hello = () => {
  const handler = () => console.log('hello world')

  return handler
}
```

The return value of the function is another function that is assigned to the handler variable.

Since the hello function returns a function, the event handler is now a function.

What's the point of this concept?

Let's change the code a tiny bit:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
    </div>
  )
}
```

Both buttons get their own individualized event handlers.

Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. The hello function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

Let's eliminate the helper variables and directly return the created function:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
  ```
Lastly, let's write all of the arrows on the same line:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```
We can use the same trick to define event handlers that set the state of the component to a given value. Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  
  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
```
Using functions that return functions is not required to achieve this functionality. Let's return the setToValue function that is responsible for updating state, into a normal function:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```
## Passing Event Handlers to Child Components

Let's extract the button into its own component:

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```
The component gets the event handler function from the `handleClick` prop, and the text of the button from the `text` prop.

Using the Button component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.

![image](https://i.imgur.com/RfgZ9Mn.png)

## Do Not Define Components Within Components

Let's start displaying the value of the application into its own Display component.

We will change the application by defining a new component inside of the App-component.

```js
// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div>

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

The application still appears to work, but don't implement components like this! Never define components inside of other components. The method provides no benefits and leads to many unpleasant problems. 

**The biggest problems are due to the fact that React treats a component defined inside of another component as a new component in every render. This makes it impossible for React to optimize the component.**

Let's instead move the Display component function to its correct place, which is outside of the App component function:

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```
