require('dotenv').config()

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personchema)

// const person = new Person({
//   name: 'Zayed',
//   number: "69420",
//   id: 44,
// })

person.save().then(result => {
  console.log('saved!')
  mongoose.connection.close()
})