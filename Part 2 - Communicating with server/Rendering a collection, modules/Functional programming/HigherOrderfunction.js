var animals = [
    {name: 'Fluffykins',species:'rabbit'},
    {name: 'Caro',species:'dog'},
    {name: 'Hamilton',species:'dog'},
    {name: 'Harold',species:'fish'},
    {name: 'Ursula',species:'cat'},
    {name: 'Jimmy',species:'fish'},

]
var isDog = function(animal){
    return animal.species === 'dog'
}
var dogs = animals.filter(isDog)
var otherAnimals = animals.reject(isDog)
console.log(dogs)
console.log(otherAnimals)

