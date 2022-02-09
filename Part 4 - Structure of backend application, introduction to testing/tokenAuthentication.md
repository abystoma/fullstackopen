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

Set the SECTRET variable in `.env` as any random string.

![image](https://i.imgur.com/VClJalW.png)

