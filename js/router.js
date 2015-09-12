import Backbone from 'backbone';
import Radio from 'backbone.radio';

let filterChannel = Radio.channel('filter');

export const Router = Backbone.Router.extend({

    routes: {
        '*filter': 'filterItems'
    },

    // Set the filter to show complete or all items
    filterItems: function (filter) {
        let newFilter = filter && filter.trim() || 'all';
        filterChannel.request('filterState').set('filter', newFilter);
    }
});
