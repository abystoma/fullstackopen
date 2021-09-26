# Node.js and Express
We will be building our backend on top of NodeJS, which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.

As mentioned in part 1, browsers don't yet support the newest features of JavaScript, and that is why the code running in the browser must be transpiled with e.g. babel. The situation with JavaScript running in the backend is different. The newest version of Node supports a large majority of the latest features of JavaScript, so we can use the latest features without having to transpile our code.

**npm** is a tool used for managing JavaScript packages. In fact, npm originates from the Node ecosystem.

## Simple program using npm
Create a new template for our application with the `npm init` command. 

We will answer the questions presented by the utility, and the result will be an automatically generated package.json file at the root of the project, that contains information about the project.

![image](https://i.imgur.com/b7knhNe.png)

![image](https://i.imgur.com/0ftOEHg.png)

Use `node index.js`or `npm start` in cmd line to run the `index.js` file.

The start npm script works because we defined it in the package.json file:


By default the package.json file also defines another commonly used npm script called npm test. Since our project does not yet have a testing library, the npm test command simply executes the following default one.


## Simple web server


