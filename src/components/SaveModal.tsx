/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React   from 'react';
import { css } from '@emotion/react';

import { modalBaseStyles } from '../GlobalStyles';
import MiniModal from './MiniModal';

import type { Pin } from 'MapAPI';
import type { ChangeEvent } from 'react';

/* ------------------------------------------
 *
 *               SAVE MODAL
 * 
 * ------------------------------------------
 */

type ModalProps = app.component.saveModal.Props;
type ModalState = app.component.saveModal.State;

class SaveModal extends React.Component<ModalProps, ModalState> {

  /*  Description:
   *    Renders the save modal using information from the places list to populate TableRow sub-components. Can handle consolidating input
   *    of a new map and can call to save the new map to the server.
   * 
   *  Expects props:
   *    - closeModal  => Function. Close the modal.
   *    - GETMaps     => Function. GET titles of the maps on the server.
   *    - saveMap     => Function. Save the current map.
   *    - places      => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */

  constructor(props: ModalProps) {

    super(props);

    this.state = { mapName: null, submodal: null };

    // Member functions
    this.closeSubModal  = this.closeSubModal.bind(this);
    this.handleInput    = this.handleInput.bind(this);
    this.handleSave     = this.handleSave.bind(this);
    this.writeMap       = this.writeMap.bind(this);

  }

  render() {

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const bodyStyle = css`
    
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      max-height: 400px;
    
    `;

    const inputStyle = css`
    
      display: flex;
    
    `;
    
    const inputPromptStyle = css`
    
      margin-left: 40px;
      font-size: 22px;
    
    `;

    const inputEleStyle = css`
    
      margin-top: 18px;
      margin-left: 5px;
    
    `;

    const saveButtonStyle = css`
    
      width: 150px;
      border: 0px;
      color: white;
      background-color: rgb(0,135,189);
    
    `;

    const tableStyle = css`
    
      flex: none;
    
    `;

    const tableHeaderStyle = css`
    
      background-color: gray;
      color: white;
      font-weight: 100;
      font-size: 14px;

      th {
        width: 186px;
      }
    
    `;

    const tableContentStyles = css`
    
      table, th, td {
        text-align: center;
        border: 2px solid black;
        padding: 10px;
      }
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    let submodal = this.state.submodal;

    return (
      <div className="modal-backdrop save-modal" css={modalBaseStyles.modalBackdrop}>
        <div className="modal-container save-modal" css={modalBaseStyles.modalContainer}>

          <div className="modal-header">

            <h2 className="modal-title">Saving Map</h2>
            <button onClick={this.props.closeModal} type="button" className="modal-x-button">&times;</button>

          </div>

          <div className="modal-input-container" css={inputStyle}>
            <h1 className="modal-input-text" css={inputPromptStyle}>Map Name:</h1>

            <div className="modal-input-element">
              <input onChange={this.handleInput} type="text" className="modal-input" css={inputEleStyle} maxLength={25} placeholder="Max 25 characters" />
            </div>

          </div>

          <div className="modal-description">
            <p>You're about to save the following locations:</p>
          </div>

          <div className="modal-body save-modal" css={bodyStyle}>

            <table className="modal-table" css={[tableStyle, tableContentStyles]}>
              <tbody>

                <tr className="modal-table-header" css={tableHeaderStyle}>
                  <th className="table-header-name">Pin Name</th>
                  <th className="table-header-latitude">Latitude</th>
                  <th className="table-header-longitude">Longitude</th>
                </tr>

                {this.props.places.map(place => 
                  <TableRow
                    key         = {(place.latLng as any)}
                    name        = {place.name}
                    description = {place.description}
                    latLng      = {place.latLng}
                  />
                )}

              </tbody>
            </table>

          </div>

          <div className="modal-footer">

            <button onClick={this.handleSave} type="button" className="modal-save-button action-button" css={saveButtonStyle}>Save</button>
            <button onClick={this.props.closeModal} type="button" className="modal-close-button action-button">Close</button>

          </div>

          <div id="sub-modal">

            {submodal}

          </div>

        </div>
      </div>
    );

  }

  closeSubModal() {

    this.setState({ 

      submodal: null

    });

  }

  handleInput(event: ChangeEvent<HTMLInputElement>) {

    /*  Description:
     *    Records the map name inputted by the user.
     */

    this.setState({

      mapName: event.target.value

    });

  }

  async handleSave() {

    /*  Description:
     *    Consolidate map and pin information to save on the server.
     */

    let formattedTitle  = this.state.mapName!.trim().replace(/\s+/g, ' ');

    let modalContent;

    let numOfPins = this.props.places.length;
    let mapTitles = [];

    if (numOfPins) {

      if (formattedTitle) {

        mapTitles = await this.props.GETMaps().catch((err) => {

          return [];
    
        });

        mapTitles = mapTitles.map( (e) => { return e.title; } );

        // Check if the current name will overwrite an existing map.
        if ( mapTitles.includes(formattedTitle) ) {

          modalContent = { message: 'This will overwrite an existing map. Are you sure?', confirmText: 'Yes', closeText: 'No' };

          this.setState({

            submodal: 
              <MiniModal
              content         = {modalContent}
              actionPrimary   = { () => {this.writeMap(formattedTitle, this.props.places)} }
              actionSecondary = {this.closeSubModal}
              actionTertiary  = {undefined}
              /> 
            
          });

        } else {

          this.writeMap(formattedTitle, this.props.places);

        }
  
      } else {
  
        alert('You must enter a name for a new map.');
  
      }

    } else {

      alert('You cannot save an empty map.');

    }

  }

  writeMap(title:string , places: Array<Pin>) {

    /*  Description:
     *    Calls to save the map with title and places, then calls to close the modal.
     */

    this.props.saveMap(title, places);
    this.props.closeModal();

  }

}

type RowProps = app.component.saveModal.row.Props;

class TableRow extends React.Component<RowProps> {

  /*  Description:
   *    Renders a table row with the specified name, description, and latitude & longitude.
   *
   *  Expects props:
   *    - name        => The row's name.
   *    - description => The row's description. Currently not displayed and only kept as data. (Optional)
   *    - latLng      => The row's latitude and longitude.
   */

  render() {

    const rowStyle = css`
    
      background-color: rgb(208, 208, 208);
      color: black;
    
    `;

    return (
      <tr className="modal-table-row" css={rowStyle} data-name={this.props.name} data-description={this.props.description} data-latlng={this.props.latLng}>

        <td className="table-row-name">{this.props.name}</td>
        <td className="table-row-latitude">{this.props.latLng.lat()}</td>
        <td className="table-row-longitude">{this.props.latLng.lng()}</td>

      </tr>
    );

  }

}

export default SaveModal;