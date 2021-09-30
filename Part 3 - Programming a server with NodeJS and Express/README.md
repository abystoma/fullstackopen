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

In the previous part, the frontend could ask for the list of notes from the json-server we had as a backend, from the address http://localhost:3001/notes. Our backend has a slightly different url structure now, as the notes can be found at http://localhost:3001/api/notes. Let's change the attribute *baseUrl* in the *src/services/notes.js* like so:


```js
import axios from 'axios'
//const baseUrl = 'http://localhost:3001/notes'

const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
```
Now frontend's GET request to http://localhost:3001/api/notes does not work for some reason:

![image](https://i.imgur.com/1AXGQ6n.png)

What's going on here? We can access the backend from a browser and from postman without any problems.

## Same origin policy and CORS
The issue lies with a thing called CORS, or Cross-Origin Resource Sharing.

In our context the problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin. Because our server is in localhost port 3001, and our frontend in localhost port 3000, they do not have the same origin.

Keep in mind, that same origin policy and CORS are not specific to React or Node. They are in fact universal principles of the operation of web applications.

We can allow requests from other origins by using Node's cors middleware.

In your backend repository, install cors with the command


```
npm install cors
```
take the middleware to use and allow for requests from all origins:

```js
const cors = require('cors')

app.use(cors())
```

And the frontend works! However, the functionality for changing the importance of notes has not yet been implemented to the backend.

The setup of our app looks now as follows:

![image](https://i.imgur.com/Kjhbfpj.png)


The react app that runs in browser fetches now the data from node/express-server that runs in localhost:3001.

## Application to the Internet
Now that the whole stack is ready, let's move our application to the internet. We'll use good old [Heroku](https://www.heroku.com/) for this.


Add a file called `Procfile` to the project's root to tell Heroku how to start the application.
```
web: npm start
```
Change the definition of the port our application uses at the bottom of the index.js file like so:

```js
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Steps to deploy:
1. `Heroku login`
2.  Create an empty git repository with `git init`
3. `git add .`
4. `heruko create` 
5. `git push heroku master`

## Frontend production build

So far we have been running React code in development mode. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on.

When the application is deployed, we must create a production build or a version of the application which is optimized for production.

A production build of applications created with create-react-app can be created with command `npm run build`.

Let's run this command from the root of the frontend project.

This creates a directory called build (which contains the only HTML file of our application, index.html ) which contains the directory static. Minified version of our application's JavaScript code will be generated to the static directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. Actually all of the code from all of the application's dependencies will also be minified into this single file.


## Serving static files from the backend
One option for deploying the frontend is to copy the production build (the build directory) to the root of the backend repository and configure the backend to show the frontend's main page (the file build/index.html) as its main page.

copy using cmd line:
```
copy "E:\Courses\fullstackopen\Part 2 - Communicating with server\notes\build" "E:\Courses\fullstackopen\Part 3 -  Programming a server with NodeJS and Express\notes"
```
The backend directory should now look as follows:
![image](https://i.imgur.com/RtIrH8f.png)
To make express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from express called static.

When we add the following amidst the declarations of middlewares

```
app.use(express.static('build'))
```

whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address. If a correct file is found, express will return it.

Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.

Because of our situation, both the frontend and the backend are at the same address, we can declare baseUrl as a relative URL. This means we can leave out the part declaring the server.

```js
import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

After the change, we have to create a new production build and copy it to the root of the backend repository.

The application can now be used from the backend address http://localhost:3001

![image](https://i.imgur.com/nMe6z9J.png)
When we use a browser to go to the address http://localhost:3001, the server returns the index.html file from the build repository. Summarized contents of the file are as follows:

```html
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```
The file contains instructions to fetch a CSS stylesheet defining the styles of the application, and two script tags which instruct the browser to fetch the JavaScript code of the application - the actual React application.

The React code fetches notes from the server address http://localhost:3001/api/notes and renders them to the screen. The communications between the server and the browser can be seen in the Network tab of the developer console:

![image](https://i.imgur.com/cKt6Aky.png)

The setup that is ready for product deployment looks as follows:

![image](https://i.imgur.com/nD2tRlH.png)

Unlike when running the app in a development environment, everything is now in the same node/express-backend that runs in localhost:3001. When the browser goes to the page, the file index.html is rendered. That causes the browser to fetch the product version of the React app. Once it starts to run, it fetches the json-data from the address localhost:3001/api/notes.

## The whole app to internet

After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to Heroku again.

The application works perfectly, except we haven't added the functionality for changing the importance of a note to the backend yet.

Our application saves the notes to a variable. If the application crashes or is restarted, all of the data will disappear.

The application needs a database. Before we introduce one, let's go through a few things.

The setup looks like now as follows:
![image](https://i.imgur.com/iXZLanj.png)

The node/express-backend now resides in the Heroku server. When the root address that is of the form https://desolate-island-46098.herokuapp.com/ is accessed, the browser loads and executes the React app that fetches the json-data from the Heroku server.

## Streamlining deploying of the frontend

To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the package.json of the backend repository:

```js
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../../Part2/notes && npm run build --prod && cp -r build ../../Part3/notes",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
//change dir to part2 and part3
```

The script `npm run build:ui` builds the frontend and copies the production version under the backend repository.

`npm run deploy` releases the current backend to heroku.

`npm run deploy:full` combines these two and contains the necessary git commands to update the backend repository.

There is also a script `npm run logs:prod` to show the heroku logs.

Note that the directory paths in the script build:ui depend on the location of repositories in the file system.
NB On Windows, npm scripts are executed in cmd.exe as the default shell which does not support bash commands. For the above bash commands to work, you can change the default shell to Bash (in the default Git for Windows installation) as follows:
```
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```
## Proxy

Changes on the frontend have caused it to no longer work in development mode (when started with command npm start), as the connection to the backend does not work.

![image](https://i.imgur.com/2FVEvkU.png)

This is due to changing the backend address to a relative URL:

```js
const baseUrl = '/api/notes'
```
Because in development mode the frontend is at the address localhost:3000, the requests to the backend go to the wrong address localhost:3000/api/notes. The backend is at localhost:3001.

If the project was created with create-react-app, this problem is easy to solve. It is enough to add the following declaration to the package.json file of the frontend repository.

```js
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"
}
```
After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:3000 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.

Now the frontend is also fine, working with the server both in development- and production mode.

A negative aspect of our approach is how complicated it is to deploy the frontend. Deploying a new version requires generating new production build of the frontend and copying it to the backend repository. This makes creating an automated deployment pipeline more difficult. Deployment pipeline means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment.

# Saving data to MongoDB

## Debugging in VsCode
You may have to configure your launch.json file to start debugging. This can be done by choosing Add Configuration... on the drop-down menu, which is located next to the green play button and above VARIABLES menu, and select Run "npm start" in a debug terminal. For more detailed setup instructions, visit Visual Studio Code's Debugging documentation.

Below you can see a screenshot where the code execution has been paused in the middle of saving a new note:
![image](https://i.imgur.com/NRH3Ijm.png)

The execution has stopped at the breakpoint in line 63. In the console you can see the value of the note variable. In the top left window you can see other things related to the state of the application.

The arrows at the top can be used for controlling the flow of the debugger.

For some reason, I don't use the Visual Studio Code debugger a whole lot.


## Chrome dev tools
Debugging is also possible with the Chrome developer console by starting your application with the command:

```
node --inspect index.js
```
You can access the debugger by clicking the green icon - the node logo - that appears in the Chrome developer console:

![image](https://i.imgur.com/1Kb691I.png)
The debugging view works the same way as it did with React applications. The Sources tab can be used for setting breakpoints where the execution of the code will be paused.


![image](https://i.imgur.com/EcuYDJV.png)
All of the application's console.log messages will appear in the Console tab of the debugger. You can also inspect values of variables and execute your own JavaScript code.

![image](https://i.imgur.com/K69ee8E.png)

## Question everything

Debugging Full Stack applications may seem tricky at first. Soon our application will also have a database in addition to the frontend and backend, and there will be many potential areas for bugs in the application.

When the application "does not work", we have to first figure out where the problem actually occurs. It's very common for the problem to exist in a place where you didn't expect it to, and it can take minutes, hours, or even days before you find the source of the problem.

The key is to be systematic. Since the problem can exist anywhere, you must question everything, and eliminate all possibilities one by one. Logging to the console, Postman, debuggers, and experience will help.

When bugs occur, the worst of all possible strategies is to continue writing code. It will guarantee that your code will soon have even more bugs, and debugging them will be even more difficult. The [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/#.YVROtJpByUl) principle from Toyota Production Systems is very effective in this situation as well.

## MongoDB
In order to store our saved notes indefinitely, we need a database. Most of the courses taught at the University of Helsinki use relational databases. In this course we will use MongoDB which is a so-called document database.

Document databases differ from relational databases in how they organize data as well as the query languages they support. Document databases are usually categorized under the NoSQL umbrella term.

Read now the chapters on [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) and [documents](https://docs.mongodb.com/manual/core/document/) from the MongoDB manual to get a basic idea on how a document database stores data.

Naturally, you can install and run MongoDB on your own computer. However, the internet is also full of Mongo database services that you can use. Our preferred MongoDB provider in this course will be MongoDB Atlas.

Once you've created and logged into your account, Atlas will recommend creating a cluster (In later versions of MongoDB Atlas, you may see create a database):

![image](https://i.imgur.com/9E4wDtk.png)
![image](https://i.imgur.com/mmPXZKh.png)
Let's wait for the cluster to be ready for use. This can take approximately 10 minutes.

Let's grant the user with permissions to read and write to the databases.

![image](https://i.imgur.com/WpQWQGQ.png)

Next we have to define the IP addresses that are allowed access to the database.

![image](https://i.imgur.com/w47p0nH.png)
For the sake of simplicity we will allow access from all IP addresses:

![image](https://i.imgur.com/IW6vPw6.png)

Finally we are ready to connect to our database. Start by clicking connect:

![image](https://i.imgur.com/ccYhgOZ.png)
and choose Connect your application:

![image](https://i.imgur.com/3f94JOQ.png)
The view displays the MongoDB URI, which is the address of the database that we will supply to the MongoDB client library we will add to our application.

The address looks like this:
`mongodb+srv://flukehermit:${password}@cluster0.euxsz.mongodb.net/note-app?retryWrites=true&w=majority`
We are now ready to use the database.

We could use the database directly from our JavaScript code with the official MongoDb Node.js driver library, but it is quite cumbersome to use. We will instead use the Mongoose library that offers a higher level API.

Mongoose could be described as an object document mapper (ODM), and saving JavaScript objects as Mongo documents is straightforward with this library.
Let's install Mongoose:

```
npm install mongoose
```
Let's not add any code dealing with Mongo to our backend just yet. Instead, let's make a practice application by creating a new file, mongo.js:

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

When the code is run with the command `node mongo.js password`, Mongo will add a new document to the database.

![image](https://i.imgur.com/omppLMO.png)
![image](https://i.imgur.com/0xPaThw.png)

The data is now stored in the right database. The view also offers the create database functionality, that can be used to create new databases from the website. Creating the database like this is not necessary, since MongoDB Atlas automatically creates a new database when an application tries to connect to a database that does not exist yet.

## Schema

After establishing the connection to the database, we define the [schema](https://mongoosejs.com/docs/guide.html) for a note and the matching [model](https://mongoosejs.com/docs/models.html):
```js
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

First we define the schema of a note that is stored in the noteSchema variable. The schema tells Mongoose how the note objects are to be stored in the database.

In the Note model definition, the first "Note" parameter is the singular name of the model. The name of the collection will be the lowercased plural notes, because the Mongoose convention is to automatically name collections as the plural (e.g. notes) when the schema refers to them in the singular (e.g. Note).

Document databases like Mongo are schemaless, meaning that the database itself does not care about the structure of the data that is stored in the database. It is possible to store documents with completely different fields in the same collection.

The idea behind Mongoose is that the data stored in the database is given a schema at the level of the application that defines the shape of the documents stored in any given collection.

## Creating and saving objects
Next, the application creates a new note object with the help of the Note [model](https://mongoosejs.com/docs/models.html)

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```
Models are so-called constructor functions that create new JavaScript objects based on the provided parameters. Since the objects are created with the model's constructor function, they have all the properties of the model, which include methods for saving the object to the database.

Saving the object to the database happens with the appropriately named `save` method, that can be provided with an event handler with the `then` method:
```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

When the object is saved to the database, the event handler provided to `then` gets called. The event handler closes the database connection with the command `mongoose.connection.close()`. If the connection is not closed, the program will never finish its execution.

The result of the save operation is in the result parameter of the event handler. The result is not that interesting when we're storing one object to the database. You can print the object to the console if you want to take a closer look at it while implementing your application or during debugging.

Let's also save a few more notes by modifying the data in the code and by executing the program again.

NB: Unfortunately the Mongoose documentation is not very consistent, with parts of it using callbacks in its examples and other parts, other styles, so it is not recommended to copy paste code directly from there. Mixing promises with old-school callbacks in the same code is not recommended.


## Fetching objects from the database
Let's comment out the code for generating new notes and replace it with the following:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```
When the code is executed, the program prints all the notes stored in the database:


![image](https://i.imgur.com/8k66Xd3.png)

The objects are retrieved from the database with the find method of the `Note` model. The parameter of the method is an object expressing search conditions. Since the parameter is an empty object`{}`, we get all of the notes stored in the `notes` collection.

The search conditions adhere to the Mongo search query syntax.

We could restrict our search to only include important notes like this:
```js
Note.find({ important: true }).then(result => {
  // ...
})
```

## Backend connected to a database
Now we have enough knowledge to start using Mongo in our application.

Let's get a quick start by copy pasting the Mongoose definitions to the index.js file:
```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  'mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```
Let's change the handler for fetching all notes to the following form:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

We can verify in the browser that the backend works for displaying all of the documents:

![image](https://i.imgur.com/CmgTnlh.png)

The application works almost perfectly. The frontend assumes that every object has a unique id in the *id* field. We also don't want to return the mongo versioning field *__v* to the frontend.

One way to format the objects returned by Mongoose is to modify the `toJSON` method of the schema, which is used on all instances of the models produced with that schema. Modifying the method works like this:

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```
Even though the *_id* property of Mongoose objects looks like a string, it is in fact an object. The `toJSON` method we defined transforms it into a string just to be safe. If we didn't make this change, it would cause more harm for us in the future once we start writing tests.

Let's respond to the HTTP request with a list of objects formatted with the `toJSON` method:
```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Now the `notes` variable is assigned to an array of objects returned by Mongo. When the response is sent in the JSON format, the `toJSON` method of each object in the array is called automatically by the [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.


## Database configuration into its own module
Before we refactor the rest of the backend to use the database, let's extract the Mongoose specific code into its own module.

Let's create a new directory for the module called *models*, and add a file called *note.js*:

Defining Node [modules](https://nodejs.org/docs/latest-v8.x/api/modules.html) differs slightly from the way of defining [ES6 modules](https://fullstackopen.com/en/part2/rendering_a_collection_modules#refactoring-modules) in part 2.

The public interface of the module is defined by setting a value to the `module.exports` variable. We will set the value to be the *Note* model. The other things defined inside of the module, like the variables `mongoose` and `url` will not be accessible or visible to users of the module.

Importing the module happens by adding the following line to `index.js`:
```js
const Note = require('./models/note')
```
This way the `Note` variable will be assigned to the same object that the module defines.
The way that the connection is made has changed slightly:

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```
It's not a good idea to hardcode the address of the database into the code, so instead the address of the database is passed to the application via the `MONGODB_URI` environment variable.

There are many ways to define the value of an environment variable. One way would be to define it when the application is started:

A more sophisticated way is to use the [dotenv](https://github.com/motdotla/dotenv#readme) library. You can install the library with the command:

```
npm install dotenv
```

To use the library, we create a .env file at the root of the project. The environment variables are defined inside of the file, and it can look like this:

```
MONGODB_URI='mongodb+srv://fullstack:sekred@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
PORT=3001
```
We also added the hardcoded port of the server into the `PORT` environment variable.

**The *.env* file should be gitignored right away, since we do not want to publish any confidential information publicly online!**
The environment variables defined in the .env file can be taken into use with the expression` require('dotenv').config()` and you can reference them in your code just like you would reference normal environment variables, with the familiar `process.env.MONGODB_URI` syntax.

Let's change the *index.js* file in the following way:

```js
require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

// ..

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

It's important that *dotenv* gets imported before the *note* model is imported. This ensures that the environment variables from the *.env* file are available globally before the code from the other modules is imported.

## Using database in route handlers
Next, let's change the rest of the backend functionality to use the database.

Creating a new note is accomplished like this:
```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

The note objects are created with the `Note` constructor function. The response is sent inside of the callback function for the `save` operation. This ensures that the response is sent only if the operation succeeded. We will discuss error handling a little bit later.

The `savedNote` parameter in the callback function is the saved and newly created note. The data sent back in the response is the formatted version created with the `toJSON` method:
```js
response.json(savedNote)
```

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```
Using Mongoose's [findById](https://mongoosejs.com/docs/api.html#model_Model.findById) method, fetching an individual note gets changed into the following:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```
## Verifying frontend and backend integration
When the backend gets expanded, it's a good idea to test the backend first with the browser, Postman or the VS Code REST client. Next, let's try creating a new note after taking the database into use:

![image](https://i.imgur.com/qpWRWdx.png)

Only once everything has been verified to work in the backend, is it a good idea to test that the frontend works with the backend. It is highly inefficient to test things exclusively through the frontend.

It's probably a good idea to integrate the frontend and backend one functionality at a time. First, we could implement fetching all of the notes from the database and test it through the backend endpoint in the browser. After this, we could verify that the frontend works with the new backend. Once everything seems to work, we would move onto the next feature.

Once we introduce a database into the mix, it is useful to inspect the state persisted in the database, e.g. from the control panel in MongoDB Atlas. Quite often little Node helper programs like the mongo.js program we wrote earlier can be very helpful during development.

## Error handling

If we try to visit the URL of a note with an id that does not actually exist e.g. http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431 where 5c41c90e84d891c15dfa3431 is not an id stored in the database, then the response will be `null`.

Let's change this behavior so that if note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found. In addition let's implement a simple `catch` block to handle cases where the promise returned by the `findById` method is rejected:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})
```
If no matching object is found in the database, the value of `note` will be `null` and the `else` block is executed. This results in a response with the status code 404 not found. If promise returned by the `findById` method is rejected, the response will have the status code 500 internal server error. The console displays more detailed information about the error.

On top of the non-existing note, there's one more error situation needed to be handled. In this situation, we are trying to fetch a note with a wrong kind of `id`, meaning an `id` that doesn't match the mongo identifier format.

If we make the following request, we will get the error message shown below:
```
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
```

Given malformed id as an argument, the `findById` method will throw an error causing the returned promise to be rejected. This will cause the callback function defined in the `catch` block to be called.

Let's make some small adjustments to the response in the catch block:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})
```
If the format of the id is incorrect, then we will end up in the error handler defined in the `catch` block. The appropriate status code for the situation is 400 Bad Request, because the situation fits the description perfectly:
*The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.*

We have also added some data to the response to shed some light on the cause of the error.

When dealing with Promises, it's almost always a good idea to add error and exception handling, because otherwise you will find yourself dealing with strange bugs.

It's never a bad idea to print the object that caused the exception to the console in the error handler.

The reason the error handler gets called might be something completely different than what you had anticipated. If you log the error to the console, you may save yourself from long and frustrating debugging sessions. Moreover, most modern services to where you deploy your application support some form of logging system that you can use to check these logs. As mentioned, Heroku is one.

Every time you're working on a project with a backend, *it is critical to keep an eye on the console output of the backend*. If you are working on a small screen, it is enough to just see a tiny slice of the output in the background. Any error messages will catch your attention even when the console is far back in the background:


![image](https://i.imgur.com/6w2w4p8.png)

