/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

/* ------------------------------------------
 *
 *                TRASHBUTTON
 * 
 * ------------------------------------------
 */

type TrashProps = app.component.misc.trashButton.Props;

class TrashButton extends React.Component<TrashProps> {

  /*  Description:
   *    Renders a trash button. Calls a handleTrash() on click.
   */

  render() {

    return (
      <button onClick={this.props.handleTrash} type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
    );

  }

}

export default TrashButton;