import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

let filterChannel = Radio.channel('filter');

// Todo List Item View
// -------------------
//
// Display an individual todo item, and respond to changes
// that are made to the item, including marking completed.
export const TodoView = Marionette.ItemView.extend({

    tagName: 'li',

    template: '#template-todoItemView',

    className: function () {
        return this.model.get('completed') ? 'completed' : 'active';
    },

    ui: {
        edit: '.edit',
        destroy: '.destroy',
        label: 'label',
        toggle: '.toggle'
    },

    events: {
        'click @ui.destroy': 'deleteModel',
        'dblclick @ui.label': 'onEditClick',
        'keydown @ui.edit': 'onEditKeypress',
        'focusout @ui.edit': 'onEditFocusout',
        'click @ui.toggle': 'toggle'
    },

    modelEvents: {
        change: 'render'
    },

    deleteModel: function () {
        this.model.destroy();
    },

    toggle: function () {
        this.model.toggle().save();
    },

    onEditClick: function () {
        this.$el.addClass('editing');
        this.ui.edit.focus();
        //move cursor to the end
        this.ui.edit.val(this.ui.edit.val());
    },

    onEditFocusout: function () {
        let todoText = this.ui.edit.val().trim();
        if (todoText) {
            this.model.set('title', todoText).save();
            this.$el.removeClass('editing');
        } else {
            this.destroy();
        }
    },

    onEditKeypress: function (e) {
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
});

// Item List View
// --------------
//
// Controls the rendering of the list of items, including the
// filtering of activs vs completed items for display.
export const ListView = Backbone.Marionette.CompositeView.extend({

    template: '#template-todoListCompositeView',

    childView: TodoView,

    childViewContainer: '#todo-list',

    ui: {
        toggle: '#toggle-all'
    },

    events: {
        'click @ui.toggle': 'onToggleAllClick'
    },

    collectionEvents: {
        'change:completed': 'render',
        all: 'setCheckAllState'
    },

    initialize: function () {
        this.listenTo(filterChannel.request('filterState'), 'change:filter', this.render, this);
    },

    filter: function (child) {
        let filteredOn = filterChannel.request('filterState').get('filter');
        return child.matchesFilter(filteredOn);
    },

    setCheckAllState: function () {
        function reduceCompleted(left, right) {
            return left && right.get('completed');
        }

        let allCompleted = this.collection.reduce(reduceCompleted, true);
        this.ui.toggle.prop('checked', allCompleted);
        this.$el.parent().toggle(!!this.collection.length);
    },

    onToggleAllClick: function (e) {
        let isChecked = e.currentTarget.checked;

        this.collection.each(function (todo) {
            todo.save({ completed: isChecked });
        });
    }
});

// Layout Header View
// ------------------
//
export const Header = Marionette.ItemView.extend({
    template: '#template-header',

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui: {
        input: '#new-todo'
    },

    events: {
        'keypress @ui.input': 'onInputKeypress',
        'keyup @ui.input': 'onInputKeyup'
    },

    // According to the spec
    // If escape is pressed during the edit, the edit state should be left and any changes be discarded.
    onInputKeyup: function (e) {
        const ESC_KEY = 27;

        if (e.which === ESC_KEY) {
            this.render();
        }
    },

    onInputKeypress: function (e) {
        const ENTER_KEY = 13;
        let todoText = this.ui.input.val().trim();

        if (e.which === ENTER_KEY && todoText) {
            this.collection.create({
                title: todoText
            });
            this.ui.input.val('');
        }
    }
});

	// Layout Footer View
	// ------------------
export const Footer = Marionette.ItemView.extend({
    template: '#template-footer',

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui: {
        filters: '#filters a',
        completed: '.completed a',
        active: '.active a',
        all: '.all a',
        summary: '#todo-count',
        clear: '#clear-completed'
    },

    events: {
        'click @ui.clear': 'onClearClick'
    },

    collectionEvents: {
        all: 'render'
    },

    templateHelpers: function() {
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
    },

    initialize: function () {
        this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
    },

    onRender: function () {
        this.$el.parent().toggle(this.collection.length > 0);
        this.updateFilterSelection();
    },

    updateFilterSelection: function () {
        this.ui.filters.removeClass('selected');
        this.ui[filterChannel.request('filterState').get('filter')].addClass('selected');
    },

    onClearClick: function () {
        let completed = this.collection.getCompleted();
        completed.forEach(function (todo) {
            todo.destroy();
        });
    }
});
