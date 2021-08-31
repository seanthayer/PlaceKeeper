/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React   from 'react';
import { css } from '@emotion/react';

import { modalBaseStyles } from 'GlobalStyles';

/* ------------------------------------------
 *
 *                MINI MODAL
 * 
 * ------------------------------------------
 */

type modalProps = app.component.miniModal.Props;

class MiniModal extends React.Component<modalProps> {

  /*  Description:
   *    Renders a mini modal for small confirmation menus, etc. 
   * 
   *  Expects props:
   *    - modalContent =>
   *        {
   *          message      : 'BODY_TEXT',
   *          confirmText  : 'CONFIRM_BUTTON_TEXT',
   *          closeText    : 'CLOSE_BUTTON_TEXT',
   *          tertiaryText : 'TERTIARY_BUTTON_TEXT' (Optional)
   *        }
   */
  
  render() {

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const containerStyle = css`
    
      display: flex;
      flex-direction: column;
      top: 25%;
      z-index: 3;
      width: 250px;
      height: fit-content;
      min-width: 250px;
      min-height: auto;
    
    `;

    const textStyle = css`
    
      text-align: center;
      border: 1px solid black;
      padding: 25px;
      margin: 5px;
      border-radius: 8px;
    
    `;

    const footerStyle = css`
    
      display: flex;
      justify-content: space-between;
      margin-left: 20px;
      margin-right: 20px;
      padding-bottom: 20px;
    
    `;

    const genericButtonStyle = css`
    
      height: 50px;
      border-radius: 5px;
    
    `;

    const yesButtonStyle = css`

      ${genericButtonStyle};
      width: fit-content;
      min-width: 55px;
      margin: 3px;
      border: 2px solid rgb(208, 208, 208);
      background-color: white;

      &:hover {
        background-color: lightgreen;
      }
    
    `;

    const noButtonStyle = css`
    
      ${genericButtonStyle};
      width: fit-content;
      min-width: 55px;
      margin: 3px;
      border: 2px solid rgb(208, 208, 208);
      background-color: white;

      &:hover {
        background-color: salmon;
      }
    
    `;

    const tertiaryButtonStyle = css`
    
      ${genericButtonStyle};
      width: fit-content;
      min-width: 55px;
      margin: 3px;
      border: 2px solid rgb(208, 208, 208);
      background-color: white;

      &:hover {
        background-color: lightgrey;
      }
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    let message       = this.props.content.message;
    let confirmText   = this.props.content.confirmText;
    let closeText     = this.props.content.closeText;
    let tertiaryText  = this.props.content.tertiaryText;

    let confirmButton   = (confirmText  ? <button onClick={this.props.actionPrimary} type="button" className="yes-button" css={yesButtonStyle}>{confirmText}</button>             : null);
    let closeButton     = (closeText    ? <button onClick={this.props.actionSecondary} type="button" className="no-button" css={noButtonStyle}>{closeText}</button>                   : null);
    let tertiaryButton  = (tertiaryText ? <button onClick={this.props.actionTertiary} type="button" className="tertiary-button" css={tertiaryButtonStyle}>{tertiaryText}</button> : null);

    return (
      <div className="modal-backdrop confirm-modal" css={modalBaseStyles.modalBackdrop}>
        <div className="modal-container confirm-modal" css={[modalBaseStyles.modalContainer, containerStyle]}>

          <div className="modal-body confirm-modal">
            <div className="modal-text confirm-modal" css={textStyle}>

              {message}

            </div> 
          </div>

          <div className="modal-footer confirm-modal" css={footerStyle}>

            {confirmButton}
            {closeButton}
            {tertiaryButton}

          </div>

        </div>
      </div>
    );

  }

}

export default MiniModal;