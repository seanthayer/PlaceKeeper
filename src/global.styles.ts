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
 *           GLOBAL EMOTION STYLES
 * 
 * ------------------------------------------
 */

const globalStyles = css`

  body {
    margin: 0;
    background: #181818;
  }

  header {
    display: flex;
    justify-content: space-between;
    min-width: 881px;
    border-bottom: 2px solid black;
    background-color: white;
  }

  main {
    margin: 25px;
  }

  .page-button {
    padding: 15px;
  }

`;

/* -----------------------
 *      MODAL STYLES
 * -----------------------
 */

const modalPos = css`

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

`;

const modalBase = {

  modalBackdrop: css`

    ${modalPos};
    z-index: 1;
    background-color: rgba(0,0,0,0.85);

  `,

  modalContainer: css`

    ${modalPos};
    z-index: 2;
    width: 700px;
    min-width: 700px;
    min-height: 675px;
    margin: 40px auto;
    background-color: #fff;
    border-radius: 15px;

    .modal-header {
      border-bottom: 1px solid rgb(208, 208, 208);
    }

    .modal-body {
      overflow: auto;
    }

    .modal-footer {
      border-top: 1px solid rgb(208, 208, 208);
      padding-top: 20px;
    }

    .modal-title {
      margin-left: 20px;
      margin-top: 10px;
      font-size: 22px;
    }

    .modal-description {
      margin-left: 20px;
    }

    .modal-x-button {
      position: absolute;
      right: 10px;
      top: 5px;
      padding: 0;
      font-size: 25px;
      border: none;
      background: none;
      color: rgb(125, 125, 125);
    }

    .modal-close-button {
      width: 80px;
      border: 2px solid rgb(208, 208, 208);
      background-color: #fff;
    }

    .action-button {
      height: 50px;
      float: right;
      margin-right: 20px;
      border-radius: 5px;
    }

  `
}

export { globalStyles, modalBase };