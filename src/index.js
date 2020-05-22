import React from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

import App from './components/App';

const store = createStore(rootReducer);

// ReactDOM.render(<Root />, document.getElementById("root"));
const rootElement = document.getElementById('root')

store.subscribe(() => { console.log('[store]',store.getState())});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
