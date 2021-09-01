/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import { css } from '@emotion/react';

/* ------------------------------------------
 *
 *      COMPONENT "PLACESLIST" STYLES
 * 
 * ------------------------------------------
 */

const title = css`

  margin: 0;
  margin-top: 5px;
  padding: 5px 5px 0px 5px;
  border: 1px solid black;
  border-radius: 5px 5px 0 0;
  background: white;
  font-family: 'Roboto';
  font-weight: 500;

`;

const list = css`

  max-height: 652px;
  height: 652px;
  border: 1px solid black;
  border-top: 0;
  border-radius: 0 0 5px 5px;
  background: dimgrey;
  overflow: auto;

`;

const element = css`

  margin: 0;
  padding: 0;
  list-style: none;

`;

/* ------------------------------------------
 *      SUB-COMPONENT "SAVEDPLACE" STYLES
 * ------------------------------------------
 */

const placeEntry = css`
    
  margin: 10px 15px 10px 15px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  background: white;

`;

const placeTitle = css`

  margin: 0;
  font-size: 14px;

`;

const placeLatLng = css`

  padding: 0;
  border: 0;
  background: none;
  color: cornflowerblue;
  font-size: 8px;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    color: aqua;
  }

`;

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export { 

  title,
  list,
  element,
  placeEntry,
  placeTitle,
  placeLatLng

};