/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import { CSSProperties } from 'react';

/* ------------------------------------------
 *
 *    COMPONENT "RENDEREDCOMPONENT" STYLES
 * 
 * ------------------------------------------
 */

const DIV1: CSSProperties = {

  position: 'absolute',
  top: '0px',
  left: '0px',
  zIndex: 0

};

const DIV3: CSSProperties = {

  transform: 'translate3d(-50%,-100%,0)',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxSizing: 'border-box',
  boxShadow: '0 2px 7px 1px rgba(0,0,0,0.3)'

};

const DIV4: CSSProperties = {

  fontWeight: 300,
  fontSize: '13px',
  fontFamily: 'Roboto, Arial, sans-serif',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'auto',
  cursor: 'default',
  maxHeight: '536px'

};

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {

  DIV1,
  DIV3,
  DIV4

};