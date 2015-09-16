import Backbone from 'backbone';
import Radio from 'backbone.radio';
import {route} from 'backbone-decorators';

let filterChannel = Radio.channel('filter');

export class Router extends Backbone.Router {

    // Set the filter to show complete or all items
    @route('*filter')
    filterItems(filter) {
        let newFilter = filter && filter.trim() || 'all';
        filterChannel.request('filterState').set('filter', newFilter);
    }
}
