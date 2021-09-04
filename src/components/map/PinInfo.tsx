/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import TrashButton from 'components/misc/TrashButton';

/* ------------------------------------------
 *
 *                 PIN INFO
 * 
 * ------------------------------------------
 */

type InfoProps = app.component.embedded.pinInfo.Props;

class PinInfo extends React.Component<InfoProps> {

  render() {

    const mapController = window.mapController;

    let description = (this.props.pin.description ? <div className="pin-infobox-description"><p>{this.props.pin.description}</p></div> : null);

    return(
      <div className="pin-infobox-container">

        <h2 className="pin-infobox-title">{this.props.pin.name}</h2>
        
        {description}

        <TrashButton handleTrash={() => {

          // this.props.cleanUp();
          mapController.removePin( this.props.pin );
          
        }}/>

      </div>
    );

  }

}

export default (PinInfo as unknown) as React.ComponentClass<InfoProps>;