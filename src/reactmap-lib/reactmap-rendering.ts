import React from 'react';
import ReactDOM from 'react-dom';
import ComponentWrapper from './components/ComponentWrapper';


const GMAPS_GET_MAPDOMNODE = (): HTMLDivElement => document.getElementById('map') as HTMLDivElement;
const GMAPS_GET_INFOBOX_DIV = (): HTMLDivElement => GMAPS_GET_MAPDOMNODE().querySelector(QUERY_INFOBOX_DIV) as HTMLDivElement;
const GMAPS_GET_TRANSFORMING_DIV = (): HTMLDivElement => GMAPS_GET_INFOBOX_DIV().parentNode as HTMLDivElement;

const QUERY_INFOBOX_DIV = 'div[style*="z-index: 107"]';


function renderComponent(component: React.ComponentClass) {

  let node    = GMAPS_GET_INFOBOX_DIV();
  let el      = React.createElement(component);
  let wrapper = React.createElement(ComponentWrapper, {}, el);

  console.log('Element => ', el);
  console.log('Wrapper => ', wrapper);

  return ReactDOM.render(wrapper, node);

}


export { renderComponent };