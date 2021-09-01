/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

/* ------------------------------------------
 *
 *                CONFIRMTEXT
 * 
 * ------------------------------------------
 */

type ConfirmProps = app.component.misc.confirmText.Props;

class ConfirmText extends React.Component<ConfirmProps> {

  /*  Description:
   *    Renders a user confirmation prompt. Calls a confirmation or reset function.
   */

  render() {

    return (
      <div className="are-you-sure">Are you sure?<i onClick={this.props.confirm} className="fas fa-check-circle"></i><i onClick={this.props.reset} className="fas fa-times-circle"></i></div>
    );

  }

}

export default ConfirmText;