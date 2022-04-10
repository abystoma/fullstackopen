# Getting data from server

Install JSON server globally: `npm install -g json-server`

A global installation is not necessary. From the root directory of the app, we can run the json-server using the command npx: `npx json-server --port 3001 --watch db.json`

Going forward, the idea will be to save the notes to the server, which in this case means saving to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application the React code also sends it to the server to make the new note persist in "memory".

## The browser as a runtime environment

We already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using XMLHttpRequest, otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.

The use of XHR is no longer recommended, and browsers already widely support the fetch method, which is based on so-called promises, instead of the event-driven model used by XHR.

Data was fetched using XHR in the following way:

```js

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

- Right at the beginning we register an event handler to the xhttp object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the xhttp object changes. 
- If the change in state means that the response to the request has arrived, then the data is handled accordingly.


- It is worth noting that the code in the event handler is defined before the request is sent to the server. 
- Despite this, the code within the event handler will be executed at a later point in time. 
- Therefore, the code does not execute synchronously "from top to bottom", but does so asynchronously. 
- JavaScript calls the event handler that was registered for the request at some point.

A synchronous way of making requests that's common in Java programming, for instance, would play out as follows (NB, this is not actually working Java code):

```js
HTTPRequest request = new HTTPRequest();

String url = "https://fullstack-exampleapp.herokuapp.com/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

| Java      | Java Script |
| ----------- | ----------- |
| In Java the code executes line by line and stops to wait for the HTTP request, which means waiting for the command request.get(...) to finish.      | On the other hand, JavaScript engines, or runtime environments, follow the asynchronous model. In principle, this requires all IO-operations (with some exceptions) to be executed as non-blocking.        |
| The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner. | This means that code execution continues immediately after calling an IO function, without waiting for it to return. |
 


When an asynchronous operation is completed, or, more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

Currently, JavaScript engines are single-threaded, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application:

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000
```

everything would work normally for 5 seconds. However, when the function defined as the parameter for setTimeout is run, the browser will be stuck for the duration of the execution of the long loop. Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome.

For the browser to remain responsive, i.e., to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.

In today's browsers, it is possible to run parallelized code with the help of so-called web workers. The event loop of an individual browser window is, however, still only handled by a single thread.
## npm

We will use the promise based function [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers.

We will be using the `axios` library instead for communication between the browser and server. It functions like fetch, but is somewhat more pleasant to use. Another good reason to use axios is our getting familiar with adding external libraries, so-called npm packages, to React projects.

**npm-commands should always be run in the project root directory**, which is where the package.json file can be found.

 Install json-server as a development dependency (only used during development) by executing the command:
 `npm install json-server --save-dev`

Make a small addition to the scripts part of the package.json file:
![image](https://i.imgur.com/VpjURWr.png)

We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:

`npm run server`

The command npm install was used twice, but with slight differences:

```
npm install axios
npm install json-server --save-dev
```
There is a fine difference in the parameters. axios is installed as a runtime dependency of the application, because the execution of the program requires the existence of the library. On the other hand, json-server was installed as a development dependency (--save-dev), since the program itself doesn't require it.

## Axios and promises

The library can be brought into use the same way other libraries, e.g. React, are, i.e. by using an appropriate import statement.

**Note:** when the content of the file index.js changes, React does not notice that automatically so you must refresh the browser to see your changes! A simple workaround to make React notice the change automatically, is to create a file named .env in the root directory of the project and add this line `FAST_REFRESH=false`. Restart the app for the applied changes to take effect.

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation.

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

1. **The promise is pending:** It means that the final value (one of the following two) is not available yet.
2. **The promise is fulfilled:** It means that the operation has completed and the final value is available, which generally is a successful operation. This state is sometimes also called resolved.
3. **The promise is rejected:** It means that an error prevented the final value from being determined, which generally represents a failed operation.

![image](https://imgur.com/WIHTgoE.png)

If we open http://localhost:3000 in the browser, we see this in console

The first promise in our example is fulfilled, representing a successful `axios.get('http://localhost:3001/notes')` request. The second one, however, is rejected, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method then:

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
The following is printed in the console:
![image](https://i.imgur.com/GGPuqnl.png)

The JavaScript runtime environment calls the callback function registered by the `then` method providing it with a `response` object as a parameter. The `response` object contains all the essential data related to the response of an HTTP GET request, which would include the returned *data*, *status code*, and *headers*.

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```
The callback function now takes the data contained within the response, stores it in a variable and prints the notes to the console.

The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is application/json; charset=utf-8 (see previous image) using the content-type header.

We can finally begin using the data fetched from the server.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import axios from 'axios'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
  )
})
```
This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the App component.



## Effect-hooks

The Effect Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

Effect hooks are precisely the right tool to use when fetching data from a server.

After changing the app component:
```js
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  ```
This is printed to the console
```
render 0 notes
effect
promise fulfilled
render 3 note
```
First the body of the function defining the component is executed and the component is rendered for the first time. At this point render 0 notes is printed, meaning data hasn't been fetched from the server yet.

```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```
This is executed immediately after rendering. The execution of the function results in effect being printed to the console, and the command axios.get initiates the fetching of data from the server as well as registers the following function as an event handler for the operation:

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
})
```

When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints promise fulfilled to the console and stores the notes received from the server into the state using the function `setNotes(response.data)`.

As always, a call to a state-updating function triggers the re-rendering of the component. As a result, render 3 notes is printed to the console, and the notes fetched from the server are rendered to the screen.

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```
Now we can see more clearly that the function useEffect actually takes two parameters. The first is a function, the effect itself. According to the documentation:

*By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.*
So by default the effect is always run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.

The second parameter of useEffect is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array [], then the effect is only run along with the first render of the component.

Note that we could have also written the code of the effect function this way:

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```
1. A reference to an event handler function is assigned to the variable eventHandler. 
2. The promise returned by the get method of Axios is stored in the variable promise. 
3. The registration of the callback happens by giving the eventHandler variable, referring to the event-handler function, as a parameter to the then method of the promise. 

It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient.

## The development runtime environment

![image](https://i.imgur.com/V6cs8CW.png)

1. The JavaScript code making up our React application is run in the browser. 
2. The browser gets the JavaScript from the React dev server, which is the application that runs after running the command npm start.
3. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file.

4. The React application running in the browser fetches the JSON formatted data from json-server running on port 3001 on the machine.
5. The server we query the data from - json-server - gets its data from the file db.json.