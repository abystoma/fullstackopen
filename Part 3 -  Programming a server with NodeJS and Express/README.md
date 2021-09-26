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




