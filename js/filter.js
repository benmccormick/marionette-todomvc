import Service from 'marionette-service';
import Backbone from 'backbone';
import {replyRadio} from 'backbone-decorators';

/* 
 * This is a simple service that maintains the 
 * state of the filter, and passes it on
 * to any other parts of the code that request it
 * This currently uses Marionette-service for its service
 * object, in Mn 3.0 this will be replaceable with
 * Marionette.Object without any external dependencies
 */
class FilterService extends Service {

    initialize() {
        this.filterState =  new Backbone.Model({
            filter: 'all'
        });
    }

    @replyRadio('filter', 'filterState')
    getFilterState() {
        return this.filterState; 
    }

}

// We create the service as a singleton
const service = new FilterService();

