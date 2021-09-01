/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import { modalBase } from 'global.styles';
import * as Styles   from 'components/MiniModal.styles';

/* ------------------------------------------
 *
 *                MINI MODAL
 * 
 * ------------------------------------------
 */

type ModalProps = app.component.miniModal.Props;

class MiniModal extends React.Component<ModalProps> {

  /*  Description:
   *    Renders a mini modal for small confirmation menus, etc. 
   */
  
  render() {

    let message       = this.props.content.message;
    let confirmText   = this.props.content.confirmText;
    let closeText     = this.props.content.closeText;
    let tertiaryText  = this.props.content.tertiaryText;

    let confirmButton   = (confirmText  ? <button onClick={this.props.actionPrimary} type="button" className="yes-button" css={Styles.yesButton}>{confirmText}</button>             : null);
    let closeButton     = (closeText    ? <button onClick={this.props.actionSecondary} type="button" className="no-button" css={Styles.noButton}>{closeText}</button>               : null);
    let tertiaryButton  = (tertiaryText ? <button onClick={this.props.actionTertiary} type="button" className="tertiary-button" css={Styles.tertiaryButton}>{tertiaryText}</button> : null);

    return (
      <div className="modal-backdrop confirm-modal" css={modalBase.modalBackdrop}>
        <div className="modal-container confirm-modal" css={[modalBase.modalContainer, Styles.container]}>

          <div className="modal-body confirm-modal">
            <div className="modal-text confirm-modal" css={Styles.text}>

              {message}

            </div> 
          </div>

          <div className="modal-footer confirm-modal" css={Styles.footer}>

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