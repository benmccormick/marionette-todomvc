import TodoMVC from './application';
import {Controller, Router} from './router';
import Backbone from 'backbone';
import $ from 'jquery';

Backbone.$ = $;

TodoMVC.on('start', function () {
    Backbone.history.start();
    var controller = new Controller();
    controller.router = new Router({
        controller: controller
    });

    controller.start();
});
//
// start the TodoMVC app (defined in js/TodoMVC.js)
TodoMVC.start();
