import Backbone from 'backbone';
import LocalStorage from 'backbone.localstorage';
import {defaults, model, comparator, localStorage} from 'backbone-decorators';

// Todo Model
// ----------
@defaults({
    title: '',
    completed: false,
    created: 0
})
export class Todo extends Backbone.Model {

    initialize() {
        if (this.isNew()) {
            this.set('created', Date.now());
        }
    }

    toggle() {
        return this.set('completed', !this.isCompleted());
    }

    isCompleted() {
        return this.get('completed');
    }

    matchesFilter(filter) {
        if (filter === 'all') {
            return true;
        }

        if (filter === 'active') {
            return !this.isCompleted();
        }

        return this.isCompleted();
    }
}

// Todo Collection
// ---------------
@model(Todo)
@localStorage('todos-backbone-marionette')
@comparator('created')
export class TodoList extends  Backbone.Collection {

    getCompleted() {
        return this.filter(this._isCompleted);
    }

    getActive() {
        return this.reject(this._isCompleted);
    }

    _isCompleted(todo) {
        return todo.isCompleted();
    }
}
