# User administration

We want to add user authentication and authorization to our application. Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.

Let's start by adding information about users to the database. There is a one-to-many relationship between the user (User) and notes (Note):
![image](https://i.imgur.com/CqliNB1.png)

If we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the id of the user who created a note would be stored in the notes table as a foreign key.

We can use object id's in Mongo to reference documents in other collections. This is similar to using foreign keys in relational databases.

Traditionally document databases like Mongo do not support join queries that are available in relational databases, used for aggregating data from multiple tables. However starting from version 3.2. Mongo has supported [lookup aggregation queries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/). We will not be taking a look at this functionality in this course.

## References across collections

If we were using a relational database the note would contain a reference key to the user who created it. In document databases we can do the same thing.

Let's assume that the users collection contains two users:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
];
```
The notes collection contains three notes that all have a user field that references a user in the users collection:

```js
[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,
  },
  {
    content: 'A proper dinosaur codes with Java',
    important: false,
    _id: 221244,
    user: 141414,
  },
]
```

Document databases do not demand the foreign key to be stored in the note resources, it could also be stored in the users collection, or even both:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [221244],
  },
]
```

Since users can have many notes, the related ids are stored in an array in the notes field.

Document databases also offer a radically different way of organizing the data: In some situations it might be beneficial to nest the entire notes array as a part of the documents in the users collection:
```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```
In this schema notes would be tightly nested under users and the database would not generate ids for them.

The structure and schema of the database is not as self-evident as it was with relational databases. The chosen schema must be one which supports the use cases of the application the best. This is not a simple design decision to make, as all use cases of the applications are not known when the design decision is made.

Paradoxically, schema-less databases like Mongo require developers to make far more radical design decisions about data organization at the beginning of the project than relational databases with schemas. On average, relational databases offer a more-or-less suitable way of organizing data for many applications.

## Mongoose schema for users

`models/user.js file`
```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```
The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows:

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```

The type of the field is ObjectId that references note-style documents. Mongo does not inherently know that this is a field that references notes, the syntax is purely related to and defined by Mongoose.

Let's expand the schema of the note defined in the models/note.js file so that the note contains information about the user who created it:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

In stark contrast to the conventions of relational databases, references are now stored in both documents: the note references the user who created it, and the user has an array of references to all of the notes created by them.

## Creating users

Let's implement a route for creating new users. Users have a unique username, a name and something called a passwordHash. The password hash is the output of a one-way hash function applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!

Let's install the bcrypt package for generating the password hashes:

```npm install bcrypt```

Let's define a separate router for dealing with users in a new controllers/users.js file. Let's take the router into use in our application in the app.js file, so that it handles requests made to the /api/users url:

```js
const usersRouter = require('./controllers/users')

// ...

app.use('/api/users', usersRouter)
```
The contents of the file that defines the router are as follows:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
```
The password sent in the request is not stored in the database. We store the hash of the password that is generated with the `bcrypt.hash` function.

The fundamentals of [storing passwords](https://codahale.com/how-to-safely-store-a-password/) are outside the scope of this course material. We will not discuss what the magic number 10 assigned to the [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds) variable means, but you can read more about it in the linked material.

Our current code does not contain any error handling or input validation for verifying that the username and password are in the desired format.

The new feature can and should initially be tested manually with a tool like Postman. However testing things manually will quickly become too cumbersome, especially once we implement functionality that enforces usernames to be unique.

It takes much less effort to write automated tests, and it will make the development of our application much easier.

## Creating a new note

The code for creating a new note has to be updated so that the note is assigned to the user who created it.

Let's expand our current implementation so, that the information about the user who created a note is sent in the userId field of the request body:

```js
const User = require('../models/user')

//...

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

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
It's worth noting that the user object also changes. The id of the note is stored in the notes field:

```js
const user = await User.findById(body.userId)

// ...

user.notes = user.notes.concat(savedNote._id)
await user.save()
```
Let's try to create a new note

![image](https://i.imgur.com/WlB0Hfb.png)
The operation appears to work. Let's add one more note and then visit the route for fetching all users:
![image](https://i.imgur.com/quQmUrm.png)

We can see that the user has two notes.

Likewise, the ids of the users who created the notes can be seen when we visit the route for fetching all notes:
![image](https://imgur.com/3fLmnGG.png)

## Populate

We would like our API to work in such a way, that when an HTTP GET request is made to the /api/users route, the user objects would also contain the contents of the user's notes, and not just their id. In a relational database, this functionality would be implemented with a join query.

As previously mentioned, document databases do not properly support join queries between collections, but the Mongoose library can do some of these joins for us. Mongoose accomplishes the join by doing multiple queries, which is different from join queries in relational databases which are transactional, meaning that the state of the database does not change during the time that the query is made. With join queries in Mongoose, nothing can guarantee that the state between the collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.

The Mongoose join is done with the [populate](https://mongoosejs.com/docs/populate.html) method. Let's update the route that returns all users first:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes')

  response.json(users)
})
```

The populate method is chained after the find method making the initial query. The parameter given to the populate method defines that the ids referencing note objects in the notes field of the user document will be replaced by the referenced note documents.

The result is almost exactly what we wanted:

![image](https://i.imgur.com/FjxxUsy.png)

We can use the populate parameter for choosing the fields we want to include from the documents. The selection of fields is done with the Mongo [syntax](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only):

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })

  response.json(users)
});
```
The result is now exactly like we want it to be:

![image](https://i.imgur.com/qsscV1Y.png)

Let's also add a suitable population of user information to notes:

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
});
```
Now the user's information is added to the user field of note objects.

![image](https://i.imgur.com/Mm2WeNJ.png)

It's important to understand that the database does not actually know that the ids stored in the user field of notes reference documents in the user collection.

The functionality of the populate method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the ref option:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```





