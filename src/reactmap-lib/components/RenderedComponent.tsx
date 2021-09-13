import React, { CSSProperties } from 'react';
import reactmap from 'reactmap-lib';

const DIV1: CSSProperties = {

  position: 'absolute',
  top: '0px',
  left: '0px',
  zIndex: 0

};

const DIV3: CSSProperties = {

  transform: 'translate3d(-50%,-100%,0)',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxSizing: 'border-box',
  boxShadow: '0 2px 7px 1px rgba(0,0,0,0.3)'

};

const DIV4: CSSProperties = {

  fontWeight: 300,
  fontSize: '13px',
  fontFamily: 'Roboto, Arial, sans-serif',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'auto',
  cursor: 'default',
  maxHeight: '536px'

};

type RenderProps = {

  ref: React.RefObject<React.Component>;
  initialOffset: reactmap.Point;

  __DEBUG__Origin: reactmap.Point;

};

type RenderState = {

  offsetStyle: CSSProperties;

};

class RenderedComponent extends React.Component<RenderProps, RenderState> {

  // offsetDiv: React.RefObject<HTMLDivElement>;
  childComponentDiv: React.RefObject<HTMLDivElement>;

  __DEBUG__Origin: reactmap.Point;
  __DEBUG__CurrentPos: reactmap.Point;

  constructor(props: RenderProps) {

    super(props);

    this.state = {

      offsetStyle: {

        position: 'absolute',
        top: this.props.initialOffset.y,
        left: this.props.initialOffset.x

      }

    };

    // this.offsetDiv = React.createRef<HTMLDivElement>();
    this.childComponentDiv = React.createRef<HTMLDivElement>();

    this.__DEBUG__Origin = this.props.__DEBUG__Origin;
    this.__DEBUG__CurrentPos = this.__DEBUG__Origin;

    // - - - -

    this.logMetadata();

  }

  render() {

    return(
      <div className="base" style={DIV1}>
        <div className="offset" style={this.state.offsetStyle}> {/*ref={this.offsetDiv}*/}
          <div role="dialog" tabIndex={-1} className="" style={DIV3}>
            <div ref={this.childComponentDiv} className="component-container" style={DIV4}>

              {this.props.children}

            </div>
          </div>
        </div>
      </div>
    );

  }

  __DEBUG__calculateWalk(x: number, y: number) {

    let diffX: number;
    let diffY: number;

    console.log('[DEV][reactmap][RenderedComponent] My current pos is => ', this.__DEBUG__CurrentPos);
    console.log('[DEV][reactmap][RenderedComponent] Incrementing by => ', { x: x, y: y });

    this.__DEBUG__CurrentPos.x += x;
    this.__DEBUG__CurrentPos.y += y;

    console.log('[DEV][reactmap][RenderedComponent] New current pos => ', this.__DEBUG__CurrentPos);

    diffX = this.__DEBUG__CurrentPos.x - this.__DEBUG__Origin.x;
    diffY = this.__DEBUG__CurrentPos.y - this.__DEBUG__Origin.y;

    console.log('[DEV][reactmap][RenderedComponent] Distance traveled from origin => ', { x: diffX, y: diffY });

  }

  logMetadata() {

    console.log('[DEV][reactmap][RenderedComponent] I am component => ', this);
    console.log('[DEV][reactmap][RenderedComponent] My offset style is => ', this.state.offsetStyle);

    console.log('[DEV][reactmap][RenderedComponent] My origin position is => ', this.__DEBUG__Origin);
    console.log('[DEV][reactmap][RenderedComponent] And my current position is => ', this.__DEBUG__CurrentPos);

  }

  adjustOffset(x: number, y: number) {

    this.__DEBUG__calculateWalk(x, y);

    this.setState((prevState) => {

      let newX = parseInt(prevState.offsetStyle.left as string) - x;
      let newY = parseInt(prevState.offsetStyle.top as string) - y;

      console.log('[DEV][reactmap] Instance => ', this);
      console.log('[DEV][reactmap][BEFORE] Offset div styles,');
      console.log(`[DEV][reactmap] -- left: ${prevState.offsetStyle.left}`);
      console.log(`[DEV][reactmap] -- top: ${prevState.offsetStyle.top}`);

      return { 

        offsetStyle: {

          position: 'absolute',
          top: newY,
          left: newX

        }

      }

    }, () => {

      console.log('[DEV][reactmap][AFTER] Offset div styles,');
      console.log(`[DEV][reactmap] -- left: ${this.state.offsetStyle.left}`);
      console.log(`[DEV][reactmap] -- top: ${this.state.offsetStyle.top}`);

    });

  }

}

export default RenderedComponent;

export type { RenderProps };