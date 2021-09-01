/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React   from 'react';
import { css } from '@emotion/react';

import { TrashButton, ConfirmText } from './Misc';
import app from 'global';

/* ------------------------------------------
 *
 *                PLACES LIST
 * 
 * ------------------------------------------
 */

type ListProps = app.component.placesList.Props;

class PlacesList extends React.Component<ListProps> {

  /*  Description:
   *    Renders the saved places list using SavedPlace sub-components. Can handle removal of a pin from within the list via the
   *    removePlace member function.
   * 
   *  Expects props:
   *    - places => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */
  
  constructor(props: ListProps) {

    super(props);
    this.removePlace = this.removePlace.bind(this);

  }

  render() {

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const titleStyle = css`
    
      margin: 0;
      margin-top: 5px;
      padding: 5px 5px 0px 5px;
      border: 1px solid black;
      border-radius: 5px 5px 0 0;
      background: white;
      font-family: 'Roboto';
      font-weight: 500;
    
    `;

    const listStyle = css`
    
      max-height: 652px;
      height: 652px;
      border: 1px solid black;
      border-top: 0;
      border-radius: 0 0 5px 5px;
      background: dimgrey;
      overflow: auto;
    
    `;

    const elementStyle = css`
    
      margin: 0;
      padding: 0;
      list-style: none;
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    return (
      <div className="saved-places-list-parent">

        <h5 className="saved-places-list-title" css={titleStyle}>Saved Places</h5>

        <div className="saved-places-list-container" css={listStyle}>
          <ul className="saved-places-list-element" css={elementStyle}>

            {this.props.places.map(place =>
              <SavedPlace
                key         = {(place.latLng as any)}
                name        = {place.name}
                description = {place.description}
                latLng      = {place.latLng}
                removePlace = {this.removePlace}
              />
            )}

          </ul>
        </div>

      </div>
    );

  }

  removePlace(latLng: google.maps.LatLng) {

    /*  Description:
     *    Removes a pin from the map using the given latLng.
     */

    const mapController = window.mapController;

    let pList         = Array.from(this.props.places);
    let pListLatLngs  = pList.map(place => place.latLng);
    let i             = pListLatLngs.indexOf(latLng);

    let pin = pList[i];

    mapController.removePin(pin);

  }

}

type placeProps = app.component.placesList.place.Props;
type placeState = app.component.placesList.place.State;

class SavedPlace extends React.Component<placeProps, placeState> {

  /*  Description:
   *    Renders a saved place list item, representing the information of a pin on the current map. Can handle panning
   *    to a pin and can call to remove a pin.
   *
   *  Expects props:
   *    - removePlace => Function. Remove a pin from the map using the given latLng.
   *    - name        => The entry's name.
   *    - description => The entry's description. Currently not displayed and only kept as data. (Optional)
   *    - latLng      => The entry's latitude and longitude on the map embed.
   */

  constructor(props: placeProps) {

    super(props);

    // Member functions
    this.panTo        = this.panTo.bind(this);
    this.handleTrash  = this.handleTrash.bind(this);
    this.confirmTrash = this.confirmTrash.bind(this);
    this.resetTrash   = this.resetTrash.bind(this);

    this.state = { contents: <TrashButton handleTrash={this.handleTrash}/> };

  }

  render() {

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const entryStyle = css`
    
      margin: 10px 15px 10px 15px;
      padding: 10px;
      border: 1px solid black;
      border-radius: 5px;
      background: white;

    `;

    const titleStyle = css`
    
      margin: 0;
      font-size: 14px;
    
    `;

    const latLngStyle = css`
    
      padding: 0;
      border: 0;
      background: none;
      color: cornflowerblue;
      font-size: 8px;

      &:hover {
        text-decoration: underline;
      }

      &:active {
        color: aqua;
      }
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    let description = null;
    
    if (this.props.description)
      description = this.props.description;

    return(
      <li>
        <div className="saved-place-entry" css={entryStyle} data-name={this.props.name} data-description={description} data-latlng={this.props.latLng}>

          <h5 className="saved-place-entry-title" css={titleStyle}>{this.props.name}</h5>
          <button onClick={this.panTo} type="button" name="saved-place-entry-latLng" className="saved-place-entry-latLng" css={latLngStyle}>({this.props.latLng.lat()}, {this.props.latLng.lng()})</button>

          <div className="trash-button-container">
            
            {this.state.contents}

          </div>

        </div>
      </li>
    );

  }

  panTo() {

    /*  Description:
     *    Pans the map embed to the current entry's latLng.
     */

    const mapController = window.mapController;
    mapController.mapEmbed.panTo(this.props.latLng);

  }
  
  handleTrash() {

    /*  Description:
     *    Prompts confirmation from the user.
     */

    this.setState({

      contents: <ConfirmText confirm={this.confirmTrash} reset={this.resetTrash}/>

    });

  }

  confirmTrash() {

    /*  Description:
     *    Calls removePlace with the current entry's latLng.
     */

    this.props.removePlace(this.props.latLng);

  }

  resetTrash() {

    /*  Description:
     *    Resets the entry's contents.
     */

    this.setState({

      contents: <TrashButton handleTrash={this.handleTrash}/>

    });

  }

}

export default PlacesList;