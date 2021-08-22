/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

/* ------------------------------------------
 *
 *                   MISC
 * 
 * ------------------------------------------
 */

class TrashButton extends React.Component {

  /*  Description:
   *    Renders a trash button. Calls a handleTrash function on click.
   *
   *  Expects props:
   *    - handleTrash => Function. Handle the functionality for trash button click.
   */

  render() {

    return (
      <button onClick={this.props.handleTrash} type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
    );

  }

}

class ConfirmText extends React.Component {

  /*  Description:
   *    Renders a user confirmation prompt. Calls a confirmation or reset function, depending on click.
   *
   *  Expects props:
   *    - confirm => Function. Handle the functionality for confirm button click.
   *    - reset   => Function. Handle the functionality for reset button click.
   */

  render() {

    return (
      <div className="are-you-sure">Are you sure?<i onClick={this.props.confirm} className="fas fa-check-circle"></i><i onClick={this.props.reset} className="fas fa-times-circle"></i></div>
    );

  }

}

export { TrashButton, ConfirmText };