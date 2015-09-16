import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import {on, template, tagName, ui, 
        onModel, useSuper, onCollection,
        childView, childViewContainer} from 'backbone-decorators';

let filterChannel = Radio.channel('filter');

// Individual Todo View
@ui({
    edit: '.edit',
    destroy: '.destroy',
    label: 'label',
    toggle: '.toggle'
})
@template('#template-todoItemView')
@tagName('li')
export class TodoView extends Marionette.ItemView {

    className() {
        return this.model.get('completed') ? 'completed' : 'active';
    }

    @useSuper
    @onModel('change')
    render(){}

    @on('click @ui.destroy')
    deleteModel() {
        this.model.destroy();
    }
    
    @on('click @ui.toggle')
    toggle() {
        this.model.toggle().save();
    }

    @on('dblclick @ui.label')
    onEditClick() {
        this.$el.addClass('editing');
        this.ui.edit.focus();
        //move cursor to the end
        this.ui.edit.val(this.ui.edit.val());
    }
    
    @on('focusout @ui.edit')
    onEditFocusout() {
        let todoText = this.ui.edit.val().trim();
        if (todoText) {
            this.model.set('title', todoText).save();
            this.$el.removeClass('editing');
        } else {
            this.destroy();
        }
    }
    
    @on('keydown @ui.edit')
    onEditKeypress(e) {
        const ENTER_KEY = 13;
        const ESC_KEY = 27;

        if (e.which === ENTER_KEY) {
            this.onEditFocusout();
            return;
        }

        if (e.which === ESC_KEY) {
            this.ui.edit.val(this.model.get('title'));
            this.$el.removeClass('editing');
        }
    }
}

// Todo List View
@ui('toggle', '#toggle-all')
@template('#template-todoListCompositeView')
@childView(TodoView)
@childViewContainer('#todo-list')
export class ListView  extends Marionette.CompositeView {


    initialize() {
        this.listenTo(filterChannel.request('filterState'), 'change:filter', this.render, this);
    }
    
    @onCollection('change:completed')
    @useSuper
    render() {}

    filter(child) {
        let filteredOn = filterChannel.request('filterState').get('filter');
        return child.matchesFilter(filteredOn);
    }
    
    @onCollection('all')
    setCheckAllState() {
        function reduceCompleted(left, right) {
            return left && right.get('completed');
        }

        let allCompleted = this.collection.reduce(reduceCompleted, true);
        this.ui.toggle.prop('checked', allCompleted);
        this.$el.parent().toggle(!!this.collection.length);
    }
    
    @on('click @ui.toggle')
    onToggleAllClick(e) {
        let isChecked = e.currentTarget.checked;

        this.collection.each(function (todo) {
            todo.save({ completed: isChecked });
        });
    }
}

// Layout Header View
//
@template('#template-header')
@ui('input', '#new-todo')
export class Header extends Marionette.ItemView {

    // According to the spec
    // If escape is pressed during the edit, the edit state should be left and any changes be discarded.
    @on('keypress @ui.input')
    onInputKeyup(e) {
        const ESC_KEY = 27;

        if (e.which === ESC_KEY) {
            this.render();
        }
    }

    @on('keyup @ui.input')
    onInputKeypress(e) {
        const ENTER_KEY = 13;
        let todoText = this.ui.input.val().trim();

        if (e.which === ENTER_KEY && todoText) {
            this.collection.create({
                title: todoText
            });
            this.ui.input.val('');
        }
    }
}

// Layout Footer View
@template('#template-footer')
@ui({
    filters: '#filters a',
    completed: '.completed a',
    active: '.active a',
    all: '.all a',
    summary: '#todo-count',
    clear: '#clear-completed'
})
export class Footer extends Marionette.ItemView {


    templateHelpers() {
        let active = this.collection.getActive().length;
        let total = this.collection.length;
        return { 
            activeCountLabel: function () {
                return (this.activeCount === 1 ? 'item' : 'items') + ' left';
            },
            activeCount: active,
            totalCount: total,
            completedCount: total - active
        }
    }

    initialize() {
        this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
    }

    @useSuper
    @onCollection('all')
    render() {}

    onRender() {
        this.$el.parent().toggle(this.collection.length > 0);
        this.updateFilterSelection();
    }

    updateFilterSelection() {
        this.ui.filters.removeClass('selected');
        this.ui[filterChannel.request('filterState').get('filter')].addClass('selected');
    }

    @on('click @ui.clear')
    onClearClick() {
        let completed = this.collection.getCompleted();
        completed.forEach(function (todo) {
            todo.destroy();
        });
    }
}
