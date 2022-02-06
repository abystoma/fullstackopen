# Structure of backend application, introduction to testing

# Project structure

```
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js 
```
So far we have been using console.log and console.error to print different information from the code. However, this is not a very good way to do things. Let's separate all printing to the console to its own module utils/logger.js:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

The logger has two functions, **info** for printing normal log messages, and **error** for all error messages.

The contents of the index.js file used for starting the application gets simplified as follows:

```js
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

The index.js file only imports the actual application from the app.js file and then starts the application. The function info of the logger-module is used for the console printout telling that the application is running.

The handling of environme nnt variables is extracted into a separate `utils/config.js` file


The other parts of the application can access the environment variables by importing the configuration module:

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

The other parts of the application can access the environment variables by importing the configuration module:

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

The route handlers have also been moved into a dedicated module. The event handlers of routes are commonly referred to as controllers, and for this reason we have created a new controllers directory. All of the routes related to notes are now in the notes.js module under the controllers directory.

The contents of the notes.js is almost an exact copy-paste of our previous index.js file.

However, there are a few significant changes. At the very beginning of the file we create a new [router](http://expressjs.com/en/api.html#router) object:

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

The module exports the router to be available for all consumers of the module.

All routes are now defined for the router object, in a similar fashion to what we had previously done with the object representing the entire application.

It's worth noting that the paths in the route handlers have shortened. In the previous version, we had:
```js
app.delete('/api/notes/:id', (request, response) => {
```
And in the current version, we have:

```js
notesRouter.delete('/:id', (request, response) => {
```

*A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.*

The router is in fact a middleware, that can be used for defining "related routes" in a single place, that is typically placed in its own module.

The app.js file that creates the actual application, takes the router into use as shown below:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```
The router we defined earlier is used if the URL of the request starts with /api/notes. For this reason, the notesRouter object must only define the relative parts of the routes, i.e. the empty path / or just the parameter /:id.

After making these changes, our app.js file looks like this:

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

The file takes different middleware into use, and one of these is the notesRouter that is attached to the /api/notes route.

Our custom middleware has been moved to a new utils/middleware.js module:

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```
The responsibility of establishing the connection to the database has been given to the app.js module. The note.js file under the models directory only defines the Mongoose schema for notes.

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

To recap, the directory structure looks like this after the changes have been made:

```
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```
For smaller applications the structure does not matter that much. Once the application starts to grow in size, you are going to have to establish some kind of structure, and separate the different responsibilities of the application into separate modules. This will make developing the application much easier.

## Testing Node applications
Let's start our testing journey by looking at unit tests. The logic of our application is so simple, that there is not much that makes sense to test with unit tests. Let's create a new file utils/for_testing.js and write a couple of simple functions that we can use for test writing practice:

There are many different testing libraries or test runners available for JavaScript. In this course we will be using a testing library developed and used internally by Facebook called jest, that resembles the previous king of JavaScript testing libraries Mocha.

**Windows users:** *Jest may not work if the path of the project directory contains a directory that has spaces in its name.*


Since tests are only executed during the development of our application, we will install jest as a development dependency with the command:

```
npm install --save-dev jest
```
Let's define the npm script test to execute tests with Jest and to report about the test execution with the verbose style:

```js
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "jest --verbose"
  },
  //...
}
```

Jest requires one to specify that the execution environment is Node. This can be done by adding the following to the end of package.json:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

Alternatively, Jest can look for a configuration file with the default name jest.config.js, where we can define the execution environment like this:

```js
module.exports = {
  testEnvironment: 'node',
};
```

Let's create a separate directory for our tests called tests and create a new file called *palindrome.test.js* with the following contents:

```js
const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
  const result = palindrome('a')

  expect(result).toBe('a')
})

test('palindrome of react', () => {
  const result = palindrome('react')

  expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
  const result = palindrome('releveler')

  expect(result).toBe('releveler')
})
```

The ESLint configuration we added to the project in the previous part complains about the test and expect commands in our test file, since the configuration does not allow globals. Let's get rid of the complaints by adding "jest": true to the env property in the .eslintrc.js file.

```js
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  "rules": {
    // ...
  },
}
```

In the first row, the test file imports the function to be tested and assigns it to a variable called palindrome:

```js
const palindrome = require('../utils/for_testing').palindrome
```

Individual test cases are defined with the test function. The first parameter of the function is the test description as a string. The second parameter is a function, that defines the functionality for the test case. The functionality for the second test case looks like this:

```js
() => {
  const result = palindrome('react')

  expect(result).toBe('tcaer')
}
```

First we execute the code to be tested, meaning that we generate a palindrome for the string react. Next we verify the results with the expect function. Expect wraps the resulting value into an object that offers a collection of matcher functions, that can be used for verifying the correctness of the result. Since in this test case we are comparing two strings, we can use the toBe matcher.

![image](https://i.imgur.com/6PChizd.png)

Jest expects by default that the names of test files contain .test. In this course, we will follow the convention of naming our tests files with the extension .test.js.

Jest has excellent error messages, let's break the test to demonstrate this:

```js
test('palindrom of react', () => {
  const result = palindrome('react')

  expect(result).toBe('tkaer')
}
```
Running the tests above results in the following error message:

![image](https://i.imgur.com/Zy4SI54.png)

Let's add a few tests for the average function, into a new file tests/average.test.js.

```js
const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
```
The test reveals that the function does not work correctly with an empty array (this is because in JavaScript dividing by zero results in NaN).

Fixing the function is quite easy:

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
```

There are a few things to notice about the tests that we just wrote. We defined a describe block around the tests that was given the name average:

Describe blocks can be used for grouping tests into logical collections. The test output of Jest also uses the name of the describe block:

![image](https://i.imgur.com/WTqbUiW.png)

As we will see later on describe blocks are necessary when we want to run some shared setup or teardown operations for a group of tests.

Another thing to notice is that we wrote the tests in quite a compact way, without assigning the output of the function being tested to a variable:

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```