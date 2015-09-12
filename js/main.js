import TodoMVC from './application';
import {Router} from './router';
import {TodoList} from './todos';
import {Root} from './layout'
import Backbone from 'backbone';
import $ from 'jquery';
import './filter';

Backbone.$ = $;


TodoMVC.on('start', function () {
    let todos = new TodoList();
    todos.fetch();

    TodoMVC.root = new Root({
        collection: todos
    });

    let router = new Router();

    Backbone.history.start();
});

// start the TodoMVC app
TodoMVC.start();
