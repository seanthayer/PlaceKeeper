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
 *          COMPONENT "APP" STYLES
 * 
 * ------------------------------------------
 */

const title = css`

  display: inline-block;
  font-family: 'Roboto Slab';
  font-size: 56px;
  margin: 47px 20px 49px 25px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 0 10px 0 10px;
  background: white;

`;

const imgSize = css`

  height: 160px;
  width: 180px;

`;

const imgContainer = css`

  ${imgSize};
  display: flex;
  margin: 5px 25px 5px 25px;
  border: 1px solid black;
  border-radius: 10px;
  background: white;

`;

const contentContainer = css`

  display: flex;
  justify-content: space-between;

`;

const mapAndButtonsContainer = css`

  display: flex;
  flex-direction: column;
  flex: 1 1;
  min-width: 484px;
  margin-right: 10px;

`;

const savedPlacesContainer = css`

  flex: 0 0;
  margin-left: 10px;

`;

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {

  title,
  imgSize,
  imgContainer,
  contentContainer,
  mapAndButtonsContainer,
  savedPlacesContainer

};