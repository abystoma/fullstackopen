# Token Authentication

Users must be able to log into our application, and when a user is logged in, their user information must automatically be attached to any new notes they create.

We will now implement support for token based authentication to the backend.

The principles of token based authentication are depicted in the following sequence diagram:

![image](https://i.imgur.com/qXW75R7.png)

Let's first implement the functionality for logging in. Install the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library, which allows us to generate [JSON web tokens](https://jwt.io/).

The code for login functionality goes to the file controllers/login.js.

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

The code starts by searching for the user from the database by the username attached to the request. Next, it checks the password, also attached to the request. Because the passwords themselves are not saved to the database, but hashes calculated from the passwords, the bcrypt.compare method is used to check if the password is correct:

```js
await bcrypt.compare(body.password, user.passwordHash)
```

If the user is not found, or the password is incorrect, the request is responded to with the status code 401 unauthorized. The reason for the failure is explained in the response body.

If the password is correct, a token is created with the method `jwt.sign`. The token contains the username and the user id in a digitally signed form.

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

The token has been digitally signed using a string from the environment variable SECRET as the secret. The digital signature ensures that only parties who know the secret can generate a valid token. The value for the environment variable must be set in the .env file.

A successful request is responded to with the status code 200 OK. The generated token and the username of the user are sent back in the response body.

Now the code for login just has to be added to the application by adding the new router to app.js.

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```
Let's try logging in using VS Code REST-client:

Set the SECRET variable in `.env` as any random string.

![image](https://i.imgur.com/VClJalW.png)

## Limiting creating new notes to logged in users

Let's change creating new notes so that it is only possible if the post request has a valid token attached. The note is then saved to the notes list of the user identified by the token.

There are several ways of sending the token from the browser to the server. We will use the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header. The header also tells which [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes) is used. This can be necessary if the server offers multiple ways to authenticate. Identifying the scheme tells the server how the attached credentials should be interpreted.

In practice, this means that if the token is for example, the string `eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`, the Authorization header will have the value:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
```

Creating new notes will change like so:

```js
const jwt = require('jsonwebtoken')

// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```
The helper function `getTokenFrom` isolates the token from the *authorization* header. The validity of the token is checked with `jwt.verify`. The method also decodes the token, or returns the Object which the token was based on. If there is no token passed, it will return error "jwt must be provided".

```
const decodedToken = jwt.verify(token, process.env.SECRET)
```

The object decoded from the token contains the *username* and *id* fields, which tells the server who made the request.

If the object decoded from the token does not contain the user's identity (`decodedToken.id` is undefined), error status code 401 unauthorized is returned and the reason for the failure is explained in the response body.

```js
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token missing or invalid'
  })
}
```

When the identity of the maker of the request is resolved, the execution continues as before.

A new note can now be created using Postman if the authorization header is given the correct value, the string bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ, where the second value is the token returned by the login operation.

Using Postman this looks as follows:

![image](https://i.imgur.com/NsqVp5v.png)

and with Visual Studio Code REST client
![image](https://i.imgur.com/DIriCQG.png)


## Error handling

Token verification can also cause a *JsonWebTokenError*. If we for example remove a few characters from the token and try creating a new note, this happens:

```
JsonWebTokenError: invalid signature
    at /Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:126:19
    at getSecret (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:80:14)
    at Object.module.exports [as verify] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/verify.js:84:10)
    at notesRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/notes.js:40:30)
```

There are many possible reasons for a decoding error. The token can be faulty (like in our example), falsified, or expired. Let's extend our errorHandler middleware to take into account the different decoding errors.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message 
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  logger.error(error.message)

  next(error)
}
```

## Problems of Token-based authentication

Token authentication is pretty easy to implement, but it contains one problem. Once the API user, eg. a React app gets a token, the API has a blind trust to the token holder. What if the access rights of the token holder should be revoked?

There are two solutions to the problem. Easier one is to limit the validity period of a token:

```js
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

Once the token expires, the client app needs to get a new token. Usually this happens by forcing the user to relogin to the app.

The error handling middleware should be extended to give a proper error in the case of a expired token:

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}
```

The shorter the expiration time, the more safe the solution is. So if the token gets into wrong hands, or the user access to the system needs to be revoked, the token is usable only a limited amount of time. On the other hand, a short expiration time forces a potential pain to a user, one must login to the system more frequently.

The other solution is to save info about each token to backend database and to check for each API request if the access right corresponding to the token is still valid. With this scheme, the access rights can be revoked at any time. This kind of solution is often called a server side session.

The negative aspect of server side sessions is the increased complexity in the backend and also the effect on performance since the token validity needs to be checked for each API request from database. A database access is considerably slower compared to checking the validity from the token itself. That is why it is a quite common to save the session corresponding to a token to a key-value-database such as Redis that is limited in functionality compared to eg. MongoDB or relational database but extremely fast in some usage scenarios.

When server side sessions are used, the token is quite often just a random string, that does not include any information about the user as it is quite often the case when jwt-tokens are used. For each API request the server fetches the relevant information about the identitity of the user from the database. It is also quite usual that instead of using Authorization-header, cookies are used as the mechanism for transferring the token between the client and the server.


