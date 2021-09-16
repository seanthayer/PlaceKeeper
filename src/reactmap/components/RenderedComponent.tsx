/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React, { CSSProperties } from 'react';
import ReactMap from 'reactmap';

import * as Styles from './RenderedComponent.styles';

/* ------------------------------------------
 *
 *            RENDERED COMPONENT
 * 
 * ------------------------------------------
 */

type RenderProps = {

  ref: React.RefObject<React.Component>;
  initialOffset: ReactMap.Point;
  worldOrigin: ReactMap.Point;

};

class RenderedComponent extends React.Component<RenderProps> {

  offsetDiv: React.RefObject<HTMLDivElement>;
  childComponentDiv: React.RefObject<HTMLDivElement>;

  offsetStyle: CSSProperties;

  worldOrigin: ReactMap.Point;

  constructor(props: RenderProps) {

    super(props);

    this.offsetDiv = React.createRef<HTMLDivElement>();
    this.childComponentDiv = React.createRef<HTMLDivElement>();

    this.offsetStyle = {

      position: 'absolute',
      top: this.props.initialOffset.y,
      left: this.props.initialOffset.x

    }

    this.worldOrigin = this.props.worldOrigin;

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

  componentDidMount() {

    this.offsetDiv.current!.style.transitionTimingFunction = 'cubic-bezier(0.0, 0.0, 0.75, 1.0)';
    this.offsetDiv.current!.style.transitionDuration = '0s';
    this.offsetDiv.current!.style.transitionProperty = 'none';

  }

  logMetadata() {

    console.log('[DEV][ReactMap][RenderedComponent] I am component => ', this);
    console.log('[DEV][ReactMap][RenderedComponent] My offset style is => ', this.offsetStyle);
    console.log('[DEV][ReactMap][RenderedComponent] My world coordinate origin is => ', this.worldOrigin);

  }

  adjustOffset(x: number, y: number) {

    let newX = parseInt(this.offsetDiv.current!.style.left as string) - x;
    let newY = parseInt(this.offsetDiv.current!.style.top as string) - y;

    this.offsetDiv.current!.style.left = `${newX}px`;
    this.offsetDiv.current!.style.top = `${newY}px`;

  }

  setOffset(x: number, y: number) {

    this.offsetDiv.current!.style.left = `${x}px`;
    this.offsetDiv.current!.style.top = `${y}px`;

  }

  smoothOffset(x: number, y: number, direction: 'in' | 'out') {

    this.offsetDiv.current!.style.transitionTimingFunction = (direction === 'in' ? 'cubic-bezier(0.0, 0.0, 0.75, 1.0)' : 'cubic-bezier(0.3, 0.4, 0.4, 0.75)');
    this.offsetDiv.current!.style.transitionProperty = 'top, left';
    this.offsetDiv.current!.style.transitionDuration = '0.3s';

    this.offsetDiv.current!.style.left = `${x}px`;
    this.offsetDiv.current!.style.top = `${y}px`;

    this.offsetDiv.current!.addEventListener('transitionend', () => {

      this.offsetDiv.current!.style.transitionProperty = 'none';

    });

  }


  /* - - - - BAD SOLUTION - - - -
  
  doZoom(direction: 'in' | 'out') {

    let x = parseInt(this.offsetDiv.current!.style.left as string);
    let y = parseInt(this.offsetDiv.current!.style.top as string);

    let newX: number;
    let newY: number;

    if (direction === 'in') {

      newX = x * 2;
      newY = y * 2;
      
    } else {

      newX = x / 2;
      newY = y / 2;

    }

    this.offsetDiv.current!.style.left = `${newX}px`;
    this.offsetDiv.current!.style.top = `${newY}px`;

  }
  */


}

export default RenderedComponent;

export type { RenderProps };