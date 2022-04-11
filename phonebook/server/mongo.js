const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://flukehermit:${password}@cluster0.dmrpz.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personchema)

const person = new Person({
  name: 'Zayed',
  number: "69420",
  id: 44,
})

person.save().then(result => {
  console.log('saved!')
  mongoose.connection.close()
})