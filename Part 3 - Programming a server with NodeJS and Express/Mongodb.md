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

## Moving error handling into middleware

We have written the code for the error handler among the rest of our code. This can be a reasonable solution at times, but there are cases where it is better to implement all error handling in a single place. This can be particularly useful if we later on want to report data related to errors to an external error tracking system like [Sentry](https://sentry.io/welcome/).

Let's change the handler for the */api/notes/:id* route, so that it passes the error forward with the next function. The next function is passed to the handler as the third parameter:

```js
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
```

The error that is passed forwards is given to the `next` function as a parameter. If `next` was called without a parameter, then the execution would simply move onto the next route or middleware. If the `next` function is called with a parameter, then the execution will continue to the *error handler middleware*.

Express [error handlers](https://expressjs.com/en/guide/error-handling.html) are middleware that are defined with a function that accepts four parameters. Our error handler looks like this:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
```

The error handler checks if the error is a CastError exception, in which case we know that the error was caused by an invalid object id for Mongo. In this situation the error handler will send a response to the browser with the response object passed as a parameter. In all other error situations, the middleware passes the error forward to the default Express error handler.

Note that the error handling middleware has to be the last loaded middleware!

## The order of middleware loading

The execution order of middleware is the same as the order that they are loaded into express with the `app.use` function. For this reason it is important to be careful when defining middleware.

The correct order is the following:

```js
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```
The json-parser middleware should be among the very first middleware loaded into Express. If the order was the following:

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```
Then the JSON data sent with the HTTP requests would not be available for the logger middleware or the POST route handler, since the `request.body` would be `undefined` at that point.

It's also important that the middleware for handling unsupported routes is next to the last middleware that is loaded into Express, just before the error handler.

For example, the following loading order would cause an issue:
```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Now the handling of unknown endpoints is ordered *before the HTTP request handler*. Since the unknown endpoint handler responds to all requests with *404 unknown endpoint*, no routes or middleware will be called after the response has been sent by unknown endpoint middleware. The only exception to this is the error handler which needs to come at the very end, after the unknown endpoints handler.

## Other operations
Let's add some missing functionality to our application, including deleting and updating an individual note.

The easiest way to delete a note from the database is with the [findByIdAndRemove](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove) method:
```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```
In both of the "successful" cases of deleting a resource, the backend responds with the status code 204 no content. The two different cases are deleting a note that exists, and deleting a note that does not exist in the database. The `result` callback parameter could be used for checking if a resource actually was deleted, and we could use that information for returning different status codes for the two cases if we deemed it necessary. Any exception that occurs is passed onto the error handler.

The toggling of the importance of a note can be easily accomplished with the findByIdAndUpdate method.

```js
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```
In the code above, we also allow the content of the note to be edited. However, we will not support changing the creation date for obvious reasons.

Notice that the `findByIdAndUpdate` method receives a regular JavaScript object as its parameter, and not a new note object created with the `Note` constructor function.

There is one important detail regarding the use of the `findByIdAndUpdate` method. By default, the `updatedNote` parameter of the event handler receives the original document [without the modifications](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate). We added the optional `{ new: true }`parameter, which will cause our event handler to be called with the new modified document instead of the original.

After testing the backend directly with Postman and the VS Code REST client, we can verify that it seems to work. The frontend also appears to work with the backend using the database.