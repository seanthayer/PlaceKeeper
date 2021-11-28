/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import { modalBase } from 'global.styles';
import * as Styles   from 'components/SaveModal.styles';

import MiniModal from './MiniModal';

import type { Pin } from 'map/API';
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
   */

  constructor(props: ModalProps) {

    super(props);

    this.state = { mapName: null, submodal: null };

    this.closeSubModal  = this.closeSubModal.bind(this);
    this.handleInput    = this.handleInput.bind(this);
    this.handleSave     = this.handleSave.bind(this);
    this.writeMap       = this.writeMap.bind(this);

  }

  render() {

    let submodal = this.state.submodal;

    return (
      <div className="modal-backdrop save-modal" css={modalBase.modalBackdrop}>
        <div className="modal-container save-modal" css={modalBase.modalContainer}>

          <div className="modal-header">

            <h2 className="modal-title">Saving Map</h2>
            <button onClick={this.props.closeModal} type="button" className="modal-x-button">&times;</button>

          </div>

          <div className="modal-input-container" css={Styles.input}>
            <h1 className="modal-input-text" css={Styles.inputPrompt}>Map Name:</h1>

            <div className="modal-input-element">
              <input onChange={this.handleInput} type="text" className="modal-input" css={Styles.inputElement} maxLength={25} placeholder="Max 25 characters" />
            </div>

          </div>

          <div className="modal-description">
            <p>You're about to save the following locations:</p>
          </div>

          <div className="modal-body save-modal" css={Styles.body}>

            <table className="modal-table" css={[Styles.table, Styles.tableContent]}>
              <tbody>

                <tr className="modal-table-header" css={Styles.tableHeader}>
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

            <button onClick={this.handleSave} type="button" className="modal-save-button action-button" css={Styles.saveButton}>Save</button>
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
   */

  render() {

    return (
      <tr className="modal-table-row" css={Styles.tableRow} data-name={this.props.name} data-description={this.props.description} data-latlng={this.props.latLng}>

        <td className="table-row-name">{this.props.name}</td>
        <td className="table-row-latitude">{this.props.latLng.lat()}</td>
        <td className="table-row-longitude">{this.props.latLng.lng()}</td>

      </tr>
    );

  }

}

export default SaveModal;