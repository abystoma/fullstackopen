## Complex state
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