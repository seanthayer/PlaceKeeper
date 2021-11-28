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
 *      COMPONENT "CONFIRMTEXT" STYLES
 * 
 * ------------------------------------------
 */

const confirm = css`

  margin-left: 5px;
  color: green;

  &:hover {

    color: lightgreen;

  }

`;

const deny = css`

  margin-left: 5px;

  &:hover {

    color: salmon;

  }

`;

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {

  confirm,
  deny
  
};