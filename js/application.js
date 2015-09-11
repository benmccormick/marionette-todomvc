import Marionette from 'backbone.marionette';
import {Root} from './layout'
import Radio from 'backbone.radio';

let filterChannel = Radio.channel('filter');

// TodoMVC is global for developing in the console
// and functional testing.
const App = Marionette.Application.extend({ });

const TodoMVC = new App();
export default TodoMVC;
export const RootLayout = new Root();

var filterState = new Backbone.Model({
    filter: 'all'
});

filterChannel.reply('filterState', function () {
    return filterState;
});

