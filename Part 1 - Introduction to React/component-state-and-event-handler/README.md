## Changes in state cause rerendering

When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the `App` component with the `setCounter` function. **Calling a function which changes the state causes the component to rerender.**

So, if a user clicks the plus button, the button's event handler changes the value of `counter` to 1, and the `App` component is rerendered. This causes its subcomponents `Display` and `Button` to also be re-rendered. `Display` receives the new value of the counter, 1, as props. The `Button` components receive event handlers which can be used to change the state of the counter.