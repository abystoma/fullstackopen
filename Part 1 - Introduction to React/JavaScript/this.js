const arto = {
    name: 'Arto Hellas',
    greet: function() {
      console.log('hello, my name is ' + this.name)
    },
  }
  
//setTimeout(arto.greet, 1000) //name is undefined
setTimeout(arto.greet.bind(arto), 1000)
