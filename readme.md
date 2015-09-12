# Backbone.Marionette ES6 TodoMVC Example

This is an implementation of the [TodoMVC app](http://todomvc.com/) using Marionette and ES6 concepts.  It is not the official TodoMVC implementation for Marionette since it uses modules and other things that are outside of the scope of what TodoMVC attempts to show.  But it is useful for learning what a modern Marionette application might look like.

**Libraries used**
-----------------

- [Marionette](http://marionettejs.com/) is the primary library used to structure the application
- [Backbone.js](http://backbonejs.org/) is a dependency of Marionette
- [jQuery](http://jquery.com) is soft dependency of Marionette
- [Underscore](http://underscorejs.org/) is a hard dependency of Marionette
- [Backbone.Radio](https://github.com/marionettejs/backbone.radio) is a messaging system used with Marionette
- [Marionette-service](https://github.com/benmccormick/marionette-service) is a shim for the Marionette-Backbone.radio integration that will be present in Marionette 3.0.0
- [Webpack](https://webpack.github.io/) is a loader for writing modular front end code
- [Babel](https://babeljs.io/) is a transpiler that allows writing ES6 code that can run in current browsers

** Getting started with this repo **
------------------------------------

To pull in your updates and run the app locally, run the following from the root of this repository

```
# install webpack
npm install -g webpack
# install local dependencies (you can skip this if not editing the code)
npm install
# run webpack (you can skip this if not editing the code) to build code
webpack
# run a local webserver (does not have to be python)
python -m SimpleHTTPServer 8000
```

The app will then be available at `http://localhost:8000`

