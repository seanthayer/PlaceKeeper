/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import ConfirmText from 'components/misc/ConfirmText';

import * as Styles from 'components/misc/TrashButton.styles';

/* ------------------------------------------
 *
 *                TRASHBUTTON
 * 
 * ------------------------------------------
 */

type TrashProps = app.component.misc.trashButton.Props;
type TrashState = app.component.misc.trashButton.State;

class TrashButton extends React.Component<TrashProps, TrashState> {

  /*  Description:
   *    Renders a trash button. Calls a handleTrash() on click.
   */

  confirming: boolean;

  constructor(props: TrashProps) {

    super(props);

    this.confirming = false;
    
    this.handleConfirm = this.handleConfirm.bind(this);

    this.state = { content: <ActionButton handle={this.handleConfirm}/> }

  }

  render() {

    return (

      <div className="trash-button-container" css={Styles.container}>

        {this.state.content}

      </div>

    );

  }

  handleConfirm(): void {

    if (this.confirming) {

      this.setState({

        content: <ActionButton handle={this.handleConfirm}/>

      });

      this.confirming = false;

    } else {

      this.setState({

        content: <ConfirmText confirm={this.props.handleTrash} reset={this.handleConfirm}/>
        
      });

      this.confirming = true;

    }

  }

}

type ActionProps = app.component.misc.trashButton.actionButton.Props;

class ActionButton extends React.Component<ActionProps> {

  render() {

    return(

      <button onClick={this.props.handle} type="button" name="trash-button" className="trash-button" css={Styles.button}><i className="far fa-trash-alt" css={Styles.icon}></i></button>

    );

  }

}

export default TrashButton;