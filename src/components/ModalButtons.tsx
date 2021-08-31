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

type ButtonsProps = app.component.modalButtons.Props;

class ModalButtons extends React.Component<ButtonsProps> {

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

type SaveProps = app.component.modalButtons.SaveProps;

class SaveButton extends React.Component<SaveProps> {

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

  constructor(props: SaveProps) {

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

type ImportProps = app.component.modalButtons.ImportProps;

class ImportButton extends React.Component<ImportProps> {

  /*  Description:
   *    Renders the import modal on click.
   *  
   *  Expects props:
   *    - showImportModal => Function. Render the import modal.
   */

  constructor(props: ImportProps) {

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