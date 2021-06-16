import ReactDOM from 'react-dom'
import App from './App'

let counter = 1


ReactDOM.render(<App />, 
document.getElementById('root'))
//The re-rendering command has been wrapped inside of the refresh function to cut down on the amount of copy-pasted code.

