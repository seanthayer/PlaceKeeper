/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React      from 'react';
import ReactDOM   from 'react-dom';
import App        from './App';
import { Loader } from '@googlemaps/js-api-loader';

import './index.css';

/* ------------------------------------------
 *
 *                   MAIN
 * 
 * ------------------------------------------
 */

const apiKey = process.env.REACT_APP_GMAPS_APIKEY || null;

var loader = new Loader({

  apiKey  : (apiKey as string),
  version : 'weekly'

});

ReactDOM.render(

  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')

);

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export { loader };
