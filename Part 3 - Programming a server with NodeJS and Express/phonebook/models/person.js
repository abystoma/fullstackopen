const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

// mongoose definitions
const url = process.env.MONGODB_URI
console.log(url);
console.log(`Connecting to ${url}...`);

mongoose.connect(url)
  .then((result) => {
    console.log('Connected to MongoDB.');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  number: {
    type: String,
  }
});

personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// const Person = mongoose.model('Person', personSchema);

module.exports = mongoose.model('Person', personSchema);