# Structure of backend application, introduction to testing

# a. Project structure

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

The handling of environment variables is extracted into a separate `utils/config.js` file


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
# b. Testing the backend

Since the backend does not contain any complicated logic, it doesn't make sense to write unit tests for it. The only potential thing we could unit test is the `toJSON` method that is used for formatting notes.

In some situations, it can be beneficial to implement some of the backend tests by mocking the database instead of using a real database. One library that could be used for this is [mongo-mock](https://github.com/williamkapke/mongo-mock).

Since our application's backend is still relatively simple, we will make the decision to test the entire application through its REST API, so that the database is also included. This kind of testing where multiple components of the system are being tested as a group, is called integration testing.

## Test environment
In one of the previous chapters of the course material, we mentioned that when your backend server is running in Heroku, it is in production mode.

The convention in Node is to define the execution mode of the application with the NODE_ENV environment variable. In our current application, we only load the environment variables defined in the .env file if the application is not in production mode.

It is common practice to define separate modes for development and testing.

Next, let's change the scripts in our package.json so that when tests are run, NODE_ENV gets the value test:

```js
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/notes && npm run build && cp -r build ../../../3/luento/notes-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"
  },
  // ...
}
```

We also added the [runInBand](https://jestjs.io/docs/cli#--runinband) option to the npm script that executes the tests. This option will prevent Jest from running tests in parallel; we will discuss its significance once our tests start using the database.

We specified the mode of the application to be development in the `npm run dev` script that uses nodemon. We also specified that the default `npm start` command will define the mode as production.

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the cross-env package as a development dependency with the command:

```
npm install --save-dev cross-env
```
We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in package.json:

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

NB: If you are deploying this aplication to heroku, keep in mind that if cross-env is saved as a development dependency, it would cause an application error on your web server. To fix this, change cross-env to a production dependency by running this in the command line:

```
npm i cross-env -P
```

Now we can modify the way that our application runs in different modes. As an example of this, we could define the application to use a separate test database when it is running tests.

We can create our separate test database in Mongo DB Atlas. This is not an optimal solution in situations where there are many people developing the same application. Test execution in particular typically requires that a single database instance is not used by tests that are running concurrently.

It would be better to run our tests using a database that is installed and running in the developer's local machine. The optimal solution would be to have every test execution use its own separate database. This is "relatively simple" to achieve by [running Mongo in-memory](https://docs.mongodb.com/manual/core/inmemory/) or by using Docker containers. We will not complicate things and will instead continue to use the MongoDB Atlas database.

Let's make some changes to the module that defines the application's configuration:

```js
require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```
The .env file has separate variables for the database addresses of the development and test databases:

```
MONGODB_URI=mongodb+srv://fullstack:secred@cluster0-ostce.mongodb.net/note-app?retryWrites=true
PORT=3001

TEST_MONGODB_URI=mongodb+srv://fullstack:secret@cluster0-ostce.mongodb.net/note-app-test?retryWrites=true
```
The `config` module that we have implemented slightly resembles the [node-config](https://github.com/lorenwest/node-config) package. Writing our own implementation is justified since our application is simple, and also because it teaches us valuable lessons.

## supertest
Let's use the [supertest](https://github.com/visionmedia/supertest) package to help us write our tests for testing the API.

Install: 
```
npm install --save-dev supertest
```
Let's write our first test in the tests/note_api.test.js file:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
```

The test imports the Express application from the app.js module and wraps it with the supertest function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the api variable and tests can use it for making HTTP requests to the backend.

Our test makes an HTTP GET request to the api/notes url and verifies that the request is responded to with the status code 200. The test also verifies that the Content-Type header is set to application/json, indicating that the data is in the desired format. (If you're not familiar with the RegEx syntax of `/application\/json/`, you can learn more [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).)

The arrow function that defines the test is preceded by the async keyword and the method call for the api object is preceded by the await keyword. 

Once all the tests (there is currently only one) have finished running we have to close the database connection used by Mongoose. This can be easily achieved with the [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) method:

```js
afterAll(() => {
  mongoose.connection.close()
})
```

When running your tests you may run across the following console warning:
![image](https://i.imgur.com/YwNfOhH.png)

If this occurs, let's follow the instructions and add a jest.config.js file at the root of the project with the following content:

```js
module.exports = {
  testEnvironment: 'node'
}
```

Another error you may come across is your test takes longer than the default Jest test timeout of 5000 ms. This can be solved by adding a third parameter to the test function:

```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```

This third parameter sets the timeout to be 100000 ms. A long timeout ensures that our test won't fail due to the time it takes to run. (A long timeout may not be what you want for tests based on performance or speed, but this is fine for our example tests).

One tiny but important detail: at the beginning of this part we extracted the Express application into the app.js file, and the role of the index.js file was changed to launch the application at the specified port with Node's built-in http object:

```js
const app = require('./app') // the actual Express app
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

The tests only use the express application defined in the app.js file:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

// ...
```

The documentation for supertest says the following:

*if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.*

In other words, supertest takes care that the application being tested is started at the port that it uses internally.

Let's write a few more tests:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

Both tests store the response of the request to the `response` variable, and unlike the previous test that used the methods provided by `supertest` for verifying the status code and headers, this time we are inspecting the response data stored in response.body property. Our tests verify the format and content of the response data with the expect method of Jest.

The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to console in test mode:

```js
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}
```

## Initializing the database before tests

Testing appears to be easy and our tests are currently passing. However, our tests are bad as they are dependent on the state of the database (that happens to be correct in my test database). In order to make our tests more robust, we have to reset the database and generate the needed test data in a controlled manner before we run the tests.

Our tests are already using the afterAll function of Jest to close the connection to the database after the tests are finished executing. Jest offers many other [functions](https://jestjs.io/docs/setup-teardown) that can be used for executing operations once before any test is run, or every time before a test is run.

Let's initialize the database before every test with the beforeEach function:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]
beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// ...
```
The database is cleared out at the beginning, and after that we save the two notes stored in the initialNotes array to the database. Doing this, we ensure that the database is in the same state before every test is run.

Let's also make the following changes to the last two tests:

```js
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})
```

Pay special attention to the expect in the latter test. The response.body.map(r => r.content)command is used to create an array containing the content of every note returned by the API. The `toContain` method is used for checking that the note given to it as a parameter is in the list of notes returned by the API.

## Running tests one by one

The npm test command executes all of the tests of the application. When we are writing tests, it is usually wise to only execute one or two tests. Jest offers a few different ways of accomplishing this, one of which is the only method. If tests are written across many files, this method is not great.

A better option is to specify the tests that need to be run as parameter of the npm test command.

The following command only runs the tests found in the tests/note_api.test.js file:

```
npm test -- tests/note_api.test.js
```

The -t option can be used for running tests with a specific name:

```
npm test -- -t "a specific note is within the returned notes"
```

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain notes in their name:

```
npm test -- -t 'notes'
```

NB: When running a single test, the mongoose connection might stay open if no tests using the connection are run. The problem might be due to the fact that supertest primes the connection, but Jest does not run the afterAll portion of the code.

## async/await
The async/await syntax that was introduced in ES7 makes it possible to use asynchronous functions that return a promise in a way that makes the code look synchronous.

As an example, the fetching of notes from the database with promises looks like this:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

The `Note.find()` method returns a promise and we can access the result of the operation by registering a callback function with the `then` method.

All of the code we want to execute once the operation finishes is written in the callback function. If we wanted to make several asynchronous function calls in sequence, the situation would soon become painful. The asynchronous calls would have to be made in the callback. This would likely lead to complicated code and could potentially give birth to a so-called [callback hell](http://callbackhell.com/).

By [chaining promises](https://javascript.info/promise-chaining) we could keep the situation somewhat under control, and avoid callback hell by creating a fairly clean chain of then method calls. We have seen a few of these during the course. To illustrate this, you can view an artificial example of a function that fetches all notes and then deletes the first one:

```js
Note.find({})
  .then(notes => {
    return notes[0].remove()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```
The then-chain is alright, but we can do better. The [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduced in ES6 provided a [clever way](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) of writing asynchronous code in a way that "looks synchronous". The syntax is a bit clunky and not widely used.

The async and await keywords introduced in ES7 bring the same functionality as the generators, but in an understandable and syntactically cleaner way to the hands of all citizens of the JavaScript world.

We could fetch all of the notes in the database by utilizing the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator like this:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

The code looks exactly like synchronous code. The execution of code pauses at `const notes = await Note.find({})` and waits until the related promise is fulfilled, and then continues its execution to the next line. When the execution continues, the result of the operation that returned a promise is assigned to the `notes` variable.
The slightly complicated example presented above could be implemented by using await like this:

```js
const notes = await Note.find({})
const response = await notes[0].remove()

console.log('the first note is removed')
```

Thanks to the new syntax, the code is a lot simpler than the previous then-chain.

There are a few important details to pay attention to when using async/await syntax. In order to use the await operator with asynchronous operations, they have to return a promise. This is not a problem as such, as regular asynchronous functions using callbacks are easy to wrap around promises.

The await keyword can't be used just anywhere in JavaScript code. Using await is possible only inside of an async function.

This means that in order for the previous examples to work, they have to be using async functions. Notice the first line in the arrow function definition:

```js
const main = async () => {
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].remove()
  console.log('the first note is removed')
}

main()
```

The code declares that the function assigned to `main` is asynchronous. After this the code calls the function with `main()`.

## async/await in the backend

Let's change the backend to async and await. As all of the asynchronous operations are currently done inside of a function, it is enough to change the route handler functions into async functions.

The route for fetching all notes gets changed to the following:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```
We can verify that our refactoring was successful by testing the endpoint through the browser and by running the tests that we wrote earlier.