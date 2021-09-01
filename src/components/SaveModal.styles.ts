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
 *      COMPONENT "SAVEMODAL" STYLES
 * 
 * ------------------------------------------
 */

const body = css`

  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  max-height: 400px;

`;

const input = css`

  display: flex;

`;

const inputPrompt = css`

  margin-left: 40px;
  font-size: 22px;

`;

const inputElement = css`

  margin-top: 18px;
  margin-left: 5px;

`;

const saveButton = css`

  width: 150px;
  border: 0px;
  color: white;
  background-color: rgb(0,135,189);

`;

const table = css`

  flex: none;

`;

const tableHeader = css`

  background-color: gray;
  color: white;
  font-weight: 100;
  font-size: 14px;

  th {
    width: 186px;
  }

`;

const tableContent = css`

  table, th, td {
    text-align: center;
    border: 2px solid black;
    padding: 10px;
  }

`;

/* ------------------------------------------
 *     SUB-COMPONENT "TABLEROW" STYLES
 * ------------------------------------------
 */

const tableRow = css`
    
  background-color: rgb(208, 208, 208);
  color: black;

`;

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {  

  body,
  input,
  inputPrompt,
  inputElement,
  saveButton,
  table,
  tableHeader,
  tableContent,
  tableRow

};