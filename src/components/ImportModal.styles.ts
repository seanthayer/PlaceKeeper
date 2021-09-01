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
 *      COMPONENT "IMPORTMODAL" STYLES
 * 
 * ------------------------------------------
 */

const body = css`

  overflow-x: auto;
  margin: 0px 20px 16px 20px;

`;

const directory = css`

  height: 300px;
  border: 1px solid black;

`;

/* ------------------------------------------
 *     SUB-COMPONENT "IMPORTENTRY" STYLES
 * ------------------------------------------
 */

const entry = css`
    
  display: inline-block;
  margin: 8px;
  border: 1px solid black;
  padding: 10px;

  &:hover .fas.fa-file {
    color: lightgreen;
  }

`;

const entryFileIcon = css`

  color: green;

`;

const entryFileTitle = css`

  display: inline;
  margin-left: 8px;
  cursor: default;
  user-select: none;

`;

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {

  body,
  directory,
  entry,
  entryFileIcon,
  entryFileTitle

};