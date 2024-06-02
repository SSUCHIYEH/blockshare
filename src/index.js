import { render } from "react-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import App from './frontend/components/App';
import * as serviceWorker from './serviceWorker';
import store from './frontend/reducer/store'
import { Provider } from 'react-redux'

const rootElement = document.getElementById("root");
render( 
  <Provider store={store}>
    <App />
  </Provider>  
  , rootElement);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();