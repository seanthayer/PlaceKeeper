/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import * as Styles from 'components/PlacesList.styles';

import TrashButton from 'components/misc/TrashButton';
import ConfirmText from 'components/misc/ConfirmText';

/* ------------------------------------------
 *
 *                PLACES LIST
 * 
 * ------------------------------------------
 */

type ListProps = app.component.placesList.Props;

class PlacesList extends React.Component<ListProps> {

  /*  Description:
   *    Renders the saved places list using SavedPlace sub-components. Can handle removal of a pin from within the list.
   */
  
  constructor(props: ListProps) {

    super(props);
    this.removePlace = this.removePlace.bind(this);

  }

  render() {

    return (
      <div className="saved-places-list-parent">

        <h5 className="saved-places-list-title" css={Styles.title}>Saved Places</h5>

        <div className="saved-places-list-container" css={Styles.list}>
          <ul className="saved-places-list-element" css={Styles.element}>

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
   */

  constructor(props: placeProps) {

    super(props);

    this.panTo        = this.panTo.bind(this);
    this.handleTrash  = this.handleTrash.bind(this);
    this.confirmTrash = this.confirmTrash.bind(this);
    this.resetTrash   = this.resetTrash.bind(this);

    this.state = { contents: <TrashButton handleTrash={this.handleTrash}/> };

  }

  render() {

    let description = null;
    
    if (this.props.description)
      description = this.props.description;

    return(
      <li>
        <div className="saved-place-entry" css={Styles.placeEntry} data-name={this.props.name} data-description={description} data-latlng={this.props.latLng}>

          <h5 className="saved-place-entry-title" css={Styles.placeTitle}>{this.props.name}</h5>
          <button onClick={this.panTo} type="button" name="saved-place-entry-latLng" className="saved-place-entry-latLng" css={Styles.placeLatLng}>({this.props.latLng.lat()}, {this.props.latLng.lng()})</button>

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

    this.props.removePlace(this.props.latLng);

  }

  resetTrash() {

    this.setState({

      contents: <TrashButton handleTrash={this.handleTrash}/>

    });

  }

}

export default PlacesList;