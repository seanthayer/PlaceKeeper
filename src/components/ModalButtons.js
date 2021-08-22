/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React   from 'react';
import { css } from '@emotion/react';

/* ------------------------------------------
 *
 *               MODAL BUTTONS
 * 
 * ------------------------------------------
 */

class ModalButtons extends React.Component {

  /*  Description:
   *    Renders import and save buttons.
   *  
   *  Expects props:
   *    - showImportModal => Function. Render the import modal.
   *    - showSaveModal   => Function. Render the save modal.
   *    - places          => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */

  render() {

    const buttonsStyle = css`
    
      display: flex;
      justify-content: space-between;
      margin: 35px;

    `;

    return (
      <div className="import-and-save-buttons-container" css={buttonsStyle}>

        <ImportButton
          showImportModal = {this.props.showImportModal}
        />

        <SaveButton
          places        = {this.props.places}
          showSaveModal = {this.props.showSaveModal}
        />

      </div>
    );

  }

}

class SaveButton extends React.Component {

  /*  Description:
   *    Renders the save modal on click.
   *  
   *  Expects props:
   *    - showSaveModal => Function. Render the save modal.
   *    - places        => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */

  constructor(props) {

    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  render() {

    return (
      <div className="save-map-element">

        <button onClick={this.handleClick} type="button" className="save-map-button page-button">Save Map</button>

      </div>
    );

  }

  handleClick() {

    this.props.showSaveModal(this.props.places);

  }

}

class ImportButton extends React.Component {

  /*  Description:
   *    Renders the import modal on click.
   *  
   *  Expects props:
   *    - showImportModal => Function. Render the import modal.
   */

  constructor(props) {

    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  render() {

    return (
      <div className="import-map-element">

        <button onClick={this.handleClick} type="button" className="import-map-button page-button">Import Map</button>

      </div>
    );

  }

  handleClick() {

    this.props.showImportModal();

  }

}

export default ModalButtons;