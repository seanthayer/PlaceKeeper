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
import MiniModal from 'components/MiniModal';

/* ------------------------------------------
 *
 *                IMPORT MODAL
 * 
 * ------------------------------------------
 */

type ModalProps = app.component.importModal.Props;
type ModalState = app.component.importModal.State;

class ImportModal extends React.Component<ModalProps, ModalState> {

  /*  Description:
   *    Renders the import modal, generating entries from the server map list. Can call to delete or load a map from the server.
   * 
   *  Expects props:
   *    - closeModal  => Function. Close the modal.
   *    - importMap   => Function. Import a map, given a title.
   *    - removeMap   => Function. Remove a map, given a title.
   *    - maps        => 
   *        [
   *          { title: 'MAP_TITLE' },
   *          . . .
   *        ]
   */
  
  constructor(props: ModalProps) {

    super(props);

    this.state = { submodal: null };

    // Member functions
    this.closeSubModal = this.closeSubModal.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.showEntryInfo = this.showEntryInfo.bind(this);

  }

  render() {

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const bodyStyle = css`
    
      overflow-x: auto;
      margin: 0px 20px 16px 20px;
    
    `;

    const directoryStyle = css`
    
      height: 300px;
      border: 1px solid black;
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    let submodal = this.state.submodal;

    return (
      <div className="modal-backdrop import-modal" css={modalBaseStyles.modalBackdrop}>
        <div className="modal-container import-modal" css={modalBaseStyles.modalContainer}>

          <div className="modal-header">

            <h2 className="modal-title">Import Map</h2>
            <button onClick={this.props.closeModal} type="button" className="modal-x-button">&times;</button>

          </div>

          <div className="modal-description">
            <p>Available Maps:</p>
          </div>

          <div className="modal-body import-modal" css={bodyStyle}>
            <div className="modal-directory-container" css={directoryStyle}>

            {this.props.maps.map(map => 
              <ImportEntry
                key           = {map.title}
                title         = {map.title}
                showEntryInfo = {this.showEntryInfo}
              />
            )}

            </div>
          </div>

          <div className="modal-footer">

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

  confirmDelete(title: string) {

    /*  Description:
     *    Prompts the user to confirm a delete action on a map. Uses the sub-modal.
     */

    let modalContent = { message: `This will permanently delete map '${title}'. Are you sure?`, confirmText: 'Yes', closeText: 'No' };

    this.closeSubModal();

    this.setState({

      submodal:
        <MiniModal 
          content         = {modalContent}
          actionPrimary   = { () => { this.props.removeMap(title); this.closeSubModal(); } }
          actionSecondary = {this.closeSubModal}
          actionTertiary  = {undefined}
        />

    });

  }

  showEntryInfo(title: string) {

    /*  Description:
     *    Renders the sub-modal, listing the selected entry's title and three action buttons (Load, Delete, Close).
     */

    let modalContent = { message: `Map title: ${title}`, confirmText: 'Load', closeText: 'Delete', tertiaryText: 'Close' };

    this.setState({

      submodal:
        <MiniModal 
          content         = {modalContent}
          actionPrimary   = { () => {this.props.importMap(title)} }
          actionSecondary = { () => {this.confirmDelete(title)} }
          actionTertiary  = {this.closeSubModal}
        /> 

    });

  }

}

type EntryProps = app.component.importModal.entry.Props;

class ImportEntry extends React.Component<EntryProps> {

  /*  Description:
   *    Renders an import entry. Calls to show entry info on click.
   * 
   *  Expects props:
   *    - showEntryInfo => Function. Show the information for the current entry, given a title.
   *    - title         => The current entry's title.
   */

  render() {

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const entryStyle = css`
    
      display: inline-block;
      margin: 8px;
      border: 1px solid black;
      padding: 10px;

      &:hover .fas.fa-file {
        color: lightgreen;
      }
    
    `;

    const fileIconStyle = css`
    
      color: green;
    
    `;

    const fileTitleStyle = css`
    
      display: inline;
      margin-left: 8px;
      cursor: default;
      user-select: none;
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    return (
      <div onClick={ () => {this.props.showEntryInfo(this.props.title)} } className="map-directory-entry-container" css={entryStyle}>

        <i className="fas fa-file" css={fileIconStyle}></i><h4 className="file-title" css={fileTitleStyle}>{this.props.title}</h4> 

      </div>
    );

  }

}

export default ImportModal;