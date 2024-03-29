/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React, { CSSProperties } from 'react';
// import ReactMap from 'reactmap';

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

  midPointOffset: {

    top: string;
    left: string;

  };

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

    this.midPointOffset = { top: '0px', left: '0px' };

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

    this.offsetDiv.current!.style.transitionTimingFunction = 'cubic-bezier(0.0, 0.0, 0.0, 0.0)';
    this.offsetDiv.current!.style.transitionDuration = '0.3s';
    this.offsetDiv.current!.style.transitionProperty = 'none';

  }

  logMetadata() {

    console.log('[DEV][ReactMap][RenderedComponent] I am component => ', this);
    console.log('[DEV][ReactMap][RenderedComponent] My offset style is => ', this.offsetStyle);
    console.log('[DEV][ReactMap][RenderedComponent] My world coordinate origin is => ', this.worldOrigin);

  }

  adjustOffset(x: number, y: number) {

    // console.log(`[DEV][ReactMap][RenderedComponent] Adjusting by ${x}, ${y}`);
    // console.log(`[DEV][ReactMap][RenderedComponent] -- Current style ${this.offsetDiv.current!.style.left}, ${this.offsetDiv.current!.style.top}`);

    let newX = parseInt(this.offsetDiv.current!.style.left as string) - x;
    let newY = parseInt(this.offsetDiv.current!.style.top as string) - y;

    // console.log(`[DEV][ReactMap][RenderedComponent] newX: ${newX}, newY: ${newY}`);

    this.offsetDiv.current!.style.left = `${newX}px`;
    this.offsetDiv.current!.style.top = `${newY}px`;

    // console.log(`[DEV][ReactMap][RenderedComponent] Adjusted to ${this.offsetDiv.current!.style.left}, ${this.offsetDiv.current!.style.top}`);

  }

  /*
  dynamicOffset(x: number, y: number) {

    console.log(`[DEV][ReactMap][RenderedComponent] Dynamic offset by ${x}, ${y}`);
    console.log(`[DEV][ReactMap][RenderedComponent] -- Midpoint style ${this.midPointOffset.left}, ${this.midPointOffset.top}`);

    let newX = parseInt(this.midPointOffset.left as string) - x;
    let newY = parseInt(this.midPointOffset.top as string) - y;

    console.log(`[DEV][ReactMap][RenderedComponent] newX: ${newX}, newY: ${newY}`);

    this.offsetDiv.current!.style.left = `${newX}px`;
    this.offsetDiv.current!.style.top = `${newY}px`;

    console.log(`[DEV][ReactMap][RenderedComponent] Adjusted to ${this.offsetDiv.current!.style.left}, ${this.offsetDiv.current!.style.top}`);

  }
  */

  setOffset(x: number, y: number) {

    this.offsetDiv.current!.style.left = `${x}px`;
    this.offsetDiv.current!.style.top = `${y}px`;

  }

  smoothOffset(x: number, y: number, direction: 'in' | 'out') {

    this.offsetDiv.current!.style.transitionProperty = 'top, left';
    this.offsetDiv.current!.style.transitionTimingFunction = (direction === 'in' ? 'cubic-bezier(0.0, 0.0, 0.75, 1.0)' : 'cubic-bezier(0.3, 0.4, 0.4, 0.75)');

    console.log(`[DEV][ReactMap][RenderedComponent] x: ${x}, y: ${y}`);

    this.offsetDiv.current!.style.left = `${x}px`;
    this.offsetDiv.current!.style.top = `${y}px`;

    this.offsetDiv.current!.addEventListener('transitionend', () => {

      console.log('[DEV][ReactMap][RenderedComponent] End transition');
      
      this.offsetDiv.current!.style.transitionProperty = 'none';

    }, { once: true });

  }

  freezeTransition() {

    let currStyle = window.getComputedStyle(this.offsetDiv.current!);
    this.midPointOffset.left = currStyle.left;
    this.midPointOffset.top = currStyle.top;

    console.log(`[DEV][ReactMap][RenderedComponent] Curr left: ${this.midPointOffset.left}, Curr top: ${this.midPointOffset.top}`);
    console.log(`[DEV][ReactMap][RenderedComponent] Going left: ${this.offsetDiv.current!.style.left}, Going top: ${this.offsetDiv.current!.style.top}`);

    this.offsetDiv.current!.style.transitionProperty = 'none';
    this.offsetDiv.current!.style.left = this.midPointOffset.left;
    this.offsetDiv.current!.style.top = this.midPointOffset.top;

  }

  __DEBUG__Offset(x: number, y: number) {

    let oldX = parseInt(this.offsetDiv.current!.style.left);
    let oldY = parseInt(this.offsetDiv.current!.style.top);

    console.log(`[DEV][ReactMap][RenderedComponent] Found deviation of (${x - oldX}, ${y - oldY})`);

    this.offsetDiv.current!.style.left = `${x}px`;
    this.offsetDiv.current!.style.top = `${y}px`;

  }

  /*
  __DEBUG__PrintOffset() {

    console.log(`[DEV][ReactMap][RenderedComponent] Current offset (${this.offsetDiv.current!.style.left}, ${this.offsetDiv.current!.style.top})`);

  }
  */

}

export default RenderedComponent;

export type { RenderProps };