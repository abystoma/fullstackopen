# Introduction to React

Let's create an application called part1 and navigate to its directory.

```
npx create-react-app part1
cd part1
```

The application is run as follows

```
npm start
```

By default, the application runs in localhost port 3000 with the address `http://localhost:3000`

## Component

The file App.js now defines a React component with the name App. The command on the final line of file index.js

```js
ReactDOM.render(<App />, document.getElementById('root'))
```
renders its contents into the div-element, defined in the file public/index.html, having the id value 'root'.

By default, the file public/index.html doesn't contain any HTML markup that is visible to us in the browser. You can try adding some HTML into the file. However, when using React, all content that needs to be rendered is usually defined as React components.

```js
const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)
```

As you probably guessed, the component will be rendered as a div-tag, which wraps a p-tag containing the text Hello world.

Technically the component is defined as a JavaScript function. The following is a function (which does not receive any parameters):

```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```

The function is then assigned to a constant variable App

There are a few ways to define functions in JavaScript. Here we will use arrow functions, which are described in a newer version of JavaScript known as ECMAScript 6, also called ES6.


It is also possible to render dynamic content inside of a component.

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```
## JSX

- It seems like React components are returning HTML markup. 
- The layout of React components is mostly written using JSX. 
- Although JSX looks like HTML, we are actually dealing with a way to write JavaScript. 
- Under the hood, JSX returned by React components is compiled into JavaScript.

After compiling, our application looks like this:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p', null, 'Hello world, it is ', now.toString()
    ),
    React.createElement(
      'p', null, a, ' plus ', b, ' is ', a + b
    )
  )
}
```

The compiling is handled by Babel. Projects created with create-react-app are configured to compile automatically. 

## props: passing data to components

It is possible to pass data to components using so called props.

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
