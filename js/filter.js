import Service from 'marionette-service';
import Backbone from 'backbone';

/* 
 * This is a simple service that maintains the 
 * state of the filter, and passes it on
 * to any other parts of the code that request it
 * This currently uses Marionette-service for its service
 * object, in Mn 3.0 this will be replaceable with
 * Marionette.Object without any external dependencies
 */
const FilterService = Service.extend({

    radioRequests: {
        'filter filterState': 'getFilterState'
    },

    initialize: function() {
        this.filterState =  new Backbone.Model({
            filter: 'all'
        });
    },

    getFilterState: function() {
        return this.filterState; 
    }

});

// We create the service as a singleton
const service = new FilterService();

