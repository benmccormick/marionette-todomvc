import Marionette from 'backbone.marionette';
import $ from 'jquery';
import {RootLayout} from './application';
import {TodoList} from './todos';
import {ListView} from './views';
import {Header, Footer} from './layout';
import Radio from 'backbone.radio';

let filterChannel = Radio.channel('filter');

export const Router = Marionette.AppRouter.extend({
    appRoutes: {
        '*filter': 'filterItems'
    }
});

// TodoList Controller (Mediator)
// ------------------------------
//
// Control the workflow and logic that exists at the application
// level, above the implementation detail of views and models
export const Controller = Marionette.Object.extend({
    initialize: function () {
        this.todoList = new TodoList();
    },
    // Start the app by showing the appropriate views
    // and fetching the list of todo items, if there are any
    start: function () {
        this.showHeader(this.todoList);
        this.showFooter(this.todoList);
        this.showTodoList(this.todoList);
        this.todoList.on('all', this.updateHiddenElements, this);
        this.todoList.fetch();
    },

    updateHiddenElements: function () {
        $('#main, #footer').toggle(!!this.todoList.length);
    },

    showHeader: function (todoList) {
        var header = new Header({
            collection: todoList
        });
        RootLayout.showChildView('header', header);
    },

    showFooter: function (todoList) {
        var footer = new Footer({
            collection: todoList
        });
        RootLayout.showChildView('footer', footer);
    },

    showTodoList: function (todoList) {
        RootLayout.showChildView('main', new ListView({
            collection: todoList
        }));
    },

    // Set the filter to show complete or all items
    filterItems: function (filter) {
        var newFilter = filter && filter.trim() || 'all';
        filterChannel.request('filterState').set('filter', newFilter);
    }
});
