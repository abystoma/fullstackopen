# Node.js and Express
We will be building our backend on top of NodeJS, which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.

As mentioned in part 1, browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be transpiled with e.g. babel. The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.

**npm** is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.

## Simple program using npm
Create a new template for our application with the `npm init` command. 

We will answer the questions presented by the utility, and the result will be an automatically generated package.json file at the root of the project, that contains information about the project.

![image](https://i.imgur.com/b7knhNe.png)

![image](https://i.imgur.com/0ftOEHg.png)

Use `node index.js`or `npm start` in cmd line to run the `index.js` file.

The start npm script works because we defined it in the package.json file:


By default the package.json file also defines another commonly used npm script called npm test. Since our project does not yet have a testing library, the npm test command simply executes the following default one.


## Simple web server
`index.js`
```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Let's take a closer look at the first line of the code:

```js
const http = require('http')
```
In the first row, the application imports Node's built-in web server module. This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:

```js
import http from 'http'
```

These days, code that runs in the browser uses ES6 modules. Modules are defined with an export and taken into use with an import.

```js
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```
The code uses the ``createServer` method of the http module to create a new web server. An event handler is registered to the server, that is called every time an HTTP request is made to the server's address http://localhost:3001.

The request is responded to with the status code 200, with the Content-Type header set to text/plain, and the content of the site to be returned set to Hello World.

The last rows bind the http server assigned to the app variable, to listen to HTTP requests sent to the port 3001:
```js
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```
The primary purpose of the backend server in this course is to offer raw data in the JSON format to the frontend.

The application/json value in the Content-Type header informs the receiver that the data is in the JSON format. The `notes` array gets transformed into JSON with the `JSON.stringify(notes)` method.


## Express
Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is express.

Let's take express into use by defining it as a project dependency with the command:

`npm install express`

The dependency is also added to our package.json file:
```js
{
  // ...
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

The source code for the dependency is installed to the node_modules directory located in the root of the project. In addition to express, you can find a great amount of other dependencies in the directory which are  the dependencies of the express library, and the dependencies of all of its dependencies, and so forth. These are called the transitive dependencies of our project.

The version 4.17.1. of express was installed in our project. What does the caret in front of the version number in package.json mean?
```js
"express": "^4.17.1"
```
The versioning model used in npm is called semantic versioning.

The caret in the front of ^4.17.1 means, that if and when the dependencies of a project are updated, the version of express that is installed will be at least 4.17.1. However, the installed version of express can also be one that has a larger patch number (the last number), or a larger minor number (the middle number). The major version of the library indicated by the first major number must be the same.

We can update the dependencies of the project with the command:

`npm update`
Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json with the command:

`npm install`
If the major number of a dependency does not change, then the newer versions should be backwards compatible. This means that if our application happened to use version 4.99.175 of express in the future, then all the code implemented in this part would still have to work without making changes to the code. In contrast, the future 5.0.0. version of express may contain changes, that would cause our application to no longer work.

## Web and express
`index.js`
```js
const express = require('express')
const app = express()

let notes = [
  ...
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Right at the beginning of our code we're importing express, which this time is a function that is used to create an express application stored in the app variable:
```js
const express = require('express')
const app = express()
```
Next, we define two routes to the application. 

1. The first one defines an event handler, that is used to handle HTTP GET requests made to the application's / root:

    ```js
    app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    })
    ```

    The event handler function accepts two parameters. The first request parameter contains all of the information of the HTTP request, and the second response parameter is used to define how the request is responded to.

    In our code, the request is answered by using the send method of the `response` object. Calling the method makes the server respond to the HTTP request by sending a response containing the string `<h1>Hello World!</h1>`, that was passed to the `send` method. Since the parameter is a string, express automatically sets the value of the Content-Type header to be text/html. The status code of the response defaults to 200.


2. The second route defines an event handler, that handles HTTP GET requests made to the notes path of the application:

    ```js
    app.get('/api/notes', (request, response) => {
    response.json(notes)
    })
    ```

    The request is responded to with the json method of the `response` object. Calling the method will send the notes array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type header with the appropriate value of application/json.


In the earlier version where we were only using Node, we had to transform the data into the JSON format with the JSON.stringify method:

```js
response.end(JSON.stringify(notes))
```

With express, this is no longer required, because this transformation happens automatically.

It's worth noting, that JSON is a string, and not a JavaScript object like the value assigned to `notes`.

## nodemon
If we make changes to the application's code we have to restart the application in order to see the changes. We restart the application by first shutting it down by typing Ctrl+C and then restarting the application. Compared to the convenient workflow in React where the browser automatically reloaded after changes were made, this feels slightly cumbersome.

The solution to this problem is nodemon:

*nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.*

Let's install nodemon by defining it as a development dependency with the command:

`npm install --save-dev nodemon`
By development dependencies, we are referring to tools that are needed only during the development of the application, e.g. for testing or automatically restarting the application, like nodemon.

These development dependencies are not needed when the application is run in production mode on the production server (e.g. Heroku).

We can start our application with nodemon like this:

`node_modules/.bin/nodemon index.js`

Changes to the application code now cause the server to restart automatically. It's worth noting, that even though the backend server restarts automatically, the browser still has to be manually refreshed. This is because unlike when working in React, we don't have the hot reload functionality needed to automatically reload the browser.

The command is long and quite unpleasant, so let's define a dedicated npm script for it in the package.json file:

```js
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```

We can now start the server in the development mode with the command:

`npm run dev`

## REST

Let's expand our application so that it provides the same RESTful HTTP API as json-server.

Representational State Transfer, aka REST is an architectural style meant for building scalable web applications.

Singular things, like notes in the case of our application, are called resources in RESTful thinking. Every resource has an associated URL which is the resource's unique address.

One convention is to create the unique address for resources by combining the name of the resource type with the resource's unique identifier.

Let's assume that the root URL of our service is www.example.com/api.

If we define the resource type of note to be notes, then the address of a note resource with the identifier 10, has the unique address www.example.com/api/notes/10.

The URL for the entire collection of all note resources is www.example.com/api/notes

We can execute different operations on resources. The operation to be executed is defined by the HTTP verb:
![image](https://i.imgur.com/MIgYeGc.png)

## Fetching a single resource
Let's expand our application so that it offers a REST interface for operating on individual notes. First let's create a route for fetching a single resource.

The unique address we will use for an individual note is of the form notes/10, where the number at the end refers to the note's unique id number.

We can define parameters for routes in express by using the colon syntax:

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

Now `app.get('/api/notes/:id', ...)` will handle all HTTP GET requests, that are of the form `/api/notes/SOMETHING`, where SOMETHING is an arbitrary string.

The id parameter in the route of a request, can be accessed through the request object:

```js
const id = request.params.id
```

The now familiar find method of arrays is used to find the note with an id that matches the parameter. The note is then returned to the sender of the request.

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```
This code does not return the notes in `http://localhost:3001/api/notes/1` this page.

Lets debug,

```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  response.json(note)
})
```
`console`
```
1 'number' '1' 'string' false
2 'number' '1' 'string' false
3 'number' '1' 'string' false
```

The cause of the bug becomes clear. The id variable contains a string '1', whereas the ids of notes are integers. In JavaScript, the "triple equals" comparison === considers all values of different types to not be equal by default, meaning that 1 is not '1'.

`Fixed`
```js
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

## Deleting resources

Deletion happens by making an HTTP DELETE request to the url of the resource:
```js
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```
If deleting the resource is successful, meaning that the note exists and it is removed, we respond to the request with the status code 204 no content and return no data with the response.

## Postman
Many tools exist for making the testing of backends easier. One of these is a command line program curl. However, instead of curl, we will take a look at using Postman for testing the application.

![image](https://i.imgur.com/xmQvgy3.png)
Using Postman is quite easy in this situation. It's enough to define the url and then select the correct request type (DELETE).

## The Visual Studio Code REST client
If you use Visual Studio Code, you can use the VS Code REST client plugin instead of Postman.


Once the plugin is installed, using it is very simple. We make a directory at the root of application named requests. We save all the REST client requests in the directory as files that end with the .rest extension.
Let's create a new get_all_notes.rest file and define the request that fetches all notes.

![image](https://i.imgur.com/vChybN6.png)

## Receiving data
Next, let's make it possible to add new notes to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in the JSON format.

In order to access the data easily, we need the help of the express [json-parser](https://expressjs.com/en/api.html), that is taken to use with command `app.use(express.json())`.

Let's activate the json-parser and implement an initial handler for dealing with the HTTP POST requests:

```js
const express = require('express')
const app = express()

app.use(express.json())

//...

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})
```
The event handler function can access the data from the body property of the request object.

Without the json-parser, the body property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the *body* property of the `request` object before the route handler is called.


For the time being, the application does not do anything with the received data besides printing it to the console and sending it back in the response.

Before we implement the rest of the application logic, let's verify with Postman that the data is actually received by the server. In addition to defining the URL and request type in Postman, we also have to define the data sent in the body:
![image](https://i.imgur.com/AzsplYc.png)

The application prints the data that we sent in the request to the console.

Similarly, it is useful to check the console for making sure that the backend behaves like we expect it to in different situations, like when we send data with an HTTP POST request. Naturally, it's a good idea to add lots of console.log commands to the code while the application is still being developed.

A potential cause for issues is an incorrectly set Content-Type header in requests. This can happen with Postman if the type of body is not defined correctly, if the Content-Type header is set to text/plain, the server appears to only receive an empty object.

The server will not be able to parse the data correctly without the correct value in the header.

If you are using VS Code, then you should install the REST client from the previous chapter now, if you haven't already. The POST request can be sent with the REST client like this:

![image](https://i.imgur.com/vDAwYSY.png)
One benefit that the REST client has over Postman is that the requests are handily available at the root of the project repository, and they can be distributed to everyone in the development team. You can also add multiple requests in the same file using ###separators:

```
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}
```

**Important sidenote**

  Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the get method of the request object, that can be used for getting the value of a single header. The request object also has the headers property, that contains all of the headers of a specific request.

  Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format

You will be able to spot this missing Content-Type header if at some point in your code you print all of the request headers with the console.log(request.headers) command.

```js
app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0

  const note = request.body
  note.id = maxId + 1

  notes = notes.concat(note)

  response.json(note)
})
```

We need a unique id for the note. First, we find out the largest id number in the current list and assign it to the `maxId` variable. The id of the new note is then defined as `maxId + 1`. This method is in fact not recommended, but we will live with it for now as we will replace it soon enough.

The current version still has the problem that the HTTP POST request can be used to add objects with arbitrary properties. Let's improve the application by defining that the content property may not be empty. The important and date properties will be given default values. All other properties are discarded:
```js
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```

If the important property is missing, we will default the value to false. The default value is currently generated in a rather odd-looking way:
```js
important: body.important || false,
```
*To be exact, when the important property is false, then the body.important || false expression will in fact return the false from the right-hand side...*

## About HTTP request types

DELETE, PUT, GET methods are idempotent while POST is not.

The property of an operation to be applied several times without changing the result beyond the initial call is called idempotence.

## Middleware

The express json-parser we took into use earlier is a so-called middleware.

Middleware are functions that can be used for handling `request` and `response` objects.

The json-parser we used earlier takes the raw data from the requests that's stored in the `request` object, parses it into a JavaScript object and assigns it to the `request` object as a new property body.

Middleware is a function that receives three parameters:
```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```
At the end of the function body the `next` function that was passed as a parameter is called. The next function yields control to the ``next` middleware.

Middleware are taken into use like this:

```
app.use(requestLogger)
```
Middleware functions are called in the order that they're taken into use with the express server object's use method. Notice that json-parser is taken into use before the requestLogger middleware, because otherwise request.body will not be initialized when the logger is executed!

Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. There are also situations where we want to define middleware functions after routes. In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.

Let's add the following middleware after our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

# Deploying app to internet
Next let's connect the frontend we made in part 2 to our own backend.


















