/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import * as Styles from 'components/misc/ConfirmText.styles';

/* ------------------------------------------
 *
 *                CONFIRMTEXT
 * 
 * ------------------------------------------
 */

type ConfirmProps = app.component.misc.trashButton.confirmText.Props;

class ConfirmText extends React.Component<ConfirmProps> {

  /*  Description:
   *    Renders a user confirmation prompt. Calls a confirmation or reset function.
   */

  render() {

    return (

      <div className="are-you-sure">Are you sure?<i onClick={this.props.confirm} className="fas fa-check-circle" css={Styles.confirm}></i><i onClick={this.props.reset} className="fas fa-times-circle" css={Styles.deny}></i></div>
      
    );

  }

}

export default ConfirmText;