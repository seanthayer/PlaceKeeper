/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React, { CSSProperties } from 'react';
import reactmap from 'reactmap';

import * as Styles from './RenderedComponent.styles';

/* ------------------------------------------
 *
 *            RENDERED COMPONENT
 * 
 * ------------------------------------------
 */

type RenderProps = {

  ref: React.RefObject<React.Component>;
  initialOffset: reactmap.Point;

};

class RenderedComponent extends React.Component<RenderProps> {

  offsetDiv: React.RefObject<HTMLDivElement>;
  childComponentDiv: React.RefObject<HTMLDivElement>;

  offsetStyle: CSSProperties;

  constructor(props: RenderProps) {

    super(props);

    this.offsetDiv = React.createRef<HTMLDivElement>();
    this.childComponentDiv = React.createRef<HTMLDivElement>();

    this.offsetStyle = {

      position: 'absolute',
      top: this.props.initialOffset.y,
      left: this.props.initialOffset.x

    }

    // - - - -

    this.logMetadata();

  }

  render() {

    return(
      <div className="base" style={Styles.DIV1}>
        <div ref={this.offsetDiv} className="offset" style={this.offsetStyle}>
          <div role="dialog" tabIndex={-1} className="" style={Styles.DIV3}>
            <div ref={this.childComponentDiv} className="component-container" style={Styles.DIV4}>

              {this.props.children}

            </div>
          </div>
        </div>
      </div>
    );

  }

  logMetadata() {

    console.log('[DEV][ReactMap][RenderedComponent] I am component => ', this);
    console.log('[DEV][ReactMap][RenderedComponent] My offset style is => ', this.offsetStyle);

  }

  adjustOffset(x: number, y: number) {

    let newX = parseInt(this.offsetDiv.current!.style.left as string) - x;
    let newY = parseInt(this.offsetDiv.current!.style.top as string) - y;

    this.offsetDiv.current!.style.left = `${newX}px`;
    this.offsetDiv.current!.style.top = `${newY}px`;

  }

}

export default RenderedComponent;

export type { RenderProps };