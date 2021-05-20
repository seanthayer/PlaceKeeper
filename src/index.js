import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Loader } from '@googlemaps/js-api-loader';
// import reportWebVitals from './reportWebVitals';

const loader = new Loader({
  apiKey: `${process.env.REACT_APP_GMAPS_APIKEY}`,
  version: 'weekly',
  clickableIcons: false
});

loader.load().then(() => {
  const google = window.google;
  let mapEmbed;

  mapEmbed = new google.maps.Map(document.querySelector('#map'), {

    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5,
    clickableIcons: false

  });
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// reportWebVitals();
