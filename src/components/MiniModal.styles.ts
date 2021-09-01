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
 *        COMPONENT "MINIMODAL" STYLES
 * 
 * ------------------------------------------
 */

const container = css`

  display: flex;
  flex-direction: column;
  top: 25%;
  z-index: 3;
  width: 250px;
  height: fit-content;
  min-width: 250px;
  min-height: auto;

`;

const text = css`

  text-align: center;
  border: 1px solid black;
  padding: 25px;
  margin: 5px;
  border-radius: 8px;

`;

const footer = css`

  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 20px;

`;

const genericButton = css`

  height: 50px;
  border-radius: 5px;

`;

const yesButton = css`

  ${genericButton};
  width: fit-content;
  min-width: 55px;
  margin: 3px;
  border: 2px solid rgb(208, 208, 208);
  background-color: white;

  &:hover {
    background-color: lightgreen;
  }

`;

const noButton = css`

  ${genericButton};
  width: fit-content;
  min-width: 55px;
  margin: 3px;
  border: 2px solid rgb(208, 208, 208);
  background-color: white;

  &:hover {
    background-color: salmon;
  }

`;

const tertiaryButton = css`

  ${genericButton};
  width: fit-content;
  min-width: 55px;
  margin: 3px;
  border: 2px solid rgb(208, 208, 208);
  background-color: white;

  &:hover {
    background-color: lightgrey;
  }

`;

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {

  container,
  text,
  footer,
  genericButton,
  yesButton,
  noButton,
  tertiaryButton,

}