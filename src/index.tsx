import createHistory from 'history/createBrowserHistory'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {routerMiddleware, routerReducer} from "react-router-redux";
import './common/common.css';
import App from './components/App/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {userReducer} from './logic/redux/reducers';

declare const module: any;

// Redux Extensions
// tslint:disable
const newCreateStore = window['devToolsExtension'] ? window['devToolsExtension']()(createStore) : createStore;

const history = createHistory();
const middelwareRouter = routerMiddleware(history);
const storeCreator = applyMiddleware(middelwareRouter)(newCreateStore);

const rootReducer = combineReducers({user: userReducer, routing: routerReducer});
const store = storeCreator(rootReducer);

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App history={history}/>
        </Provider>,
        document.getElementById('root') as HTMLElement
    );
};

// hot reload
if (module.hot) {
    module.hot.accept("./components/App/App", () => {
        render();
    })
}

render();





registerServiceWorker();
