# Deploying app to internet
Next let's connect the frontend we made in part 2 to our own backend.

In the previous part, the frontend could ask for the list of notes from the json-server we had as a backend, from the address http://localhost:3001/notes. Our backend has a slightly different url structure now, as the notes can be found at http://localhost:3001/api/notes. Let's change the attribute *baseUrl* in the *src/services/notes.js* like so:


```js
import axios from 'axios'
//const baseUrl = 'http://localhost:3001/notes'

const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
```

We will also need to change the url specified in the effect in App.js:

```js
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/notes')
      .then(res => {
        setNotes(res.data)
      })
  }, [])
```

Now frontend's GET request to http://localhost:3001/api/notes does not work for some reason:

![image](https://i.imgur.com/1AXGQ6n.png)

What's going on here? We can access the backend from a browser and from postman without any problems.

## Same origin policy and CORS
The issue lies with a thing called CORS, or Cross-Origin Resource Sharing.

In our context the problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin. Because our server is in localhost port 3001, and our frontend in localhost port 3000, they do not have the same origin.

Keep in mind, that same origin policy and CORS are not specific to React or Node. They are in fact universal principles of the operation of web applications.

We can allow requests from other origins by using Node's cors middleware.

In your backend repository, install cors with the command


```
npm install cors
```
take the middleware to use and allow for requests from all origins:

```js
const cors = require('cors')

app.use(cors())
```

And the frontend works! However, the functionality for changing the importance of notes has not yet been implemented to the backend.

The setup of our app looks now as follows:

![image](https://i.imgur.com/Kjhbfpj.png)


The react app that runs in browser fetches now the data from node/express-server that runs in localhost:3001.

## Application to the Internet
Now that the whole stack is ready, let's move our application to the internet. We'll use good old [Heroku](https://www.heroku.com/) for this.


Add a file called `Procfile` to the project's root to tell Heroku how to start the application.
```
web: npm start
```
Change the definition of the port our application uses at the bottom of the index.js file like so:

```js
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Steps to deploy:
1. `Heroku login`
2.  Create an empty git repository with `git init`
3. `git add .`
4. `heruko create` 
5. `git push heroku master`

## Frontend production build

So far we have been running React code in development mode. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on.

When the application is deployed, we must create a production build or a version of the application which is optimized for production.

A production build of applications created with create-react-app can be created with command `npm run build`.

Let's run this command from the root of the frontend project.

This creates a directory called build (which contains the only HTML file of our application, index.html ) which contains the directory static. Minified version of our application's JavaScript code will be generated to the static directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. Actually all of the code from all of the application's dependencies will also be minified into this single file.


## Serving static files from the backend
One option for deploying the frontend is to copy the production build (the build directory) to the root of the backend repository and configure the backend to show the frontend's main page (the file build/index.html) as its main page.

copy using cmd line:
```
copy "E:\Courses\fullstackopen\Part 2 - Communicating with server\notes\build" "E:\Courses\fullstackopen\Part 3 -  Programming a server with NodeJS and Express\notes"
```
The backend directory should now look as follows:
![image](https://i.imgur.com/RtIrH8f.png)
To make express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from express called static.

When we add the following amidst the declarations of middlewares

```
app.use(express.static('build'))
```

whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address. If a correct file is found, express will return it.

Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.

Because of our situation, both the frontend and the backend are at the same address, we can declare baseUrl as a relative URL. This means we can leave out the part declaring the server.

```js
import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

After the change, we have to create a new production build and copy it to the root of the backend repository.

The application can now be used from the backend address http://localhost:3001

![image](https://i.imgur.com/nMe6z9J.png)

When we use a browser to go to the address http://localhost:3001, the server returns the index.html file from the build repository. Summarized contents of the file are as follows:

```html
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```
The file contains instructions to fetch a CSS stylesheet defining the styles of the application, and two script tags which instruct the browser to fetch the JavaScript code of the application - the actual React application.

The React code fetches notes from the server address http://localhost:3001/api/notes and renders them to the screen. The communications between the server and the browser can be seen in the Network tab of the developer console:

![image](https://i.imgur.com/cKt6Aky.png)

The setup that is ready for product deployment looks as follows:

![image](https://i.imgur.com/nD2tRlH.png)

Unlike when running the app in a development environment, everything is now in the same node/express-backend that runs in localhost:3001. When the browser goes to the page, the file index.html is rendered. That causes the browser to fetch the product version of the React app. Once it starts to run, it fetches the json-data from the address localhost:3001/api/notes.

## The whole app to internet

After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to Heroku again.

The application works perfectly, except we haven't added the functionality for changing the importance of a note to the backend yet.

Our application saves the notes to a variable. If the application crashes or is restarted, all of the data will disappear.

The application needs a database. Before we introduce one, let's go through a few things.

The setup looks like now as follows:
![image](https://i.imgur.com/iXZLanj.png)

The node/express-backend now resides in the Heroku server. When the root address that is of the form https://desolate-island-46098.herokuapp.com/ is accessed, the browser loads and executes the React app that fetches the json-data from the Heroku server.

## Streamlining deploying of the frontend

To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the package.json of the backend repository:

```js
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../../Part2/notes && npm run build --prod && cp -r build ../../Part3/notes",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
//change dir to part2 and part3
```

The script `npm run build:ui` builds the frontend and copies the production version under the backend repository.

`npm run deploy` releases the current backend to heroku.

`npm run deploy:full` combines these two and contains the necessary git commands to update the backend repository.

There is also a script `npm run logs:prod` to show the heroku logs.

Note that the directory paths in the script build:ui depend on the location of repositories in the file system.
NB On Windows, npm scripts are executed in cmd.exe as the default shell which does not support bash commands. For the above bash commands to work, you can change the default shell to Bash (in the default Git for Windows installation) as follows:
```
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```
## Proxy

Changes on the frontend have caused it to no longer work in development mode (when started with command npm start), as the connection to the backend does not work.

![image](https://i.imgur.com/2FVEvkU.png)

This is due to changing the backend address to a relative URL:

```js
const baseUrl = '/api/notes'
```
Because in development mode the frontend is at the address localhost:3000, the requests to the backend go to the wrong address localhost:3000/api/notes. The backend is at localhost:3001.

If the project was created with create-react-app, this problem is easy to solve. It is enough to add the following declaration to the package.json file of the frontend repository.

```js
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"
}
```
After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:3000 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.

Now the frontend is also fine, working with the server both in development- and production mode.

A negative aspect of our approach is how complicated it is to deploy the frontend. Deploying a new version requires generating new production build of the frontend and copying it to the backend repository. This makes creating an automated deployment pipeline more difficult. Deployment pipeline means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment.