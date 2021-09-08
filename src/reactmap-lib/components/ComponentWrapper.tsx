import React, { CSSProperties } from "react";

const DIV1: CSSProperties = {

  position: 'absolute',
  top: '0px',
  left: '0px',
  zIndex: 0

};

const DIV2: CSSProperties = {

  position: 'absolute',
  top: 0,
  left: 0

};

const DIV3: CSSProperties = {};

const DIV4: CSSProperties = {

  transform: 'translate3d(-50%,-100%,0)',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxSizing: 'border-box',
  boxShadow: '0 2px 7px 1px rgba(0,0,0,0.3)'

};

const DIV5: CSSProperties = {

  fontWeight: 300,
  fontSize: '13px',
  fontFamily: 'Roboto, Arial, sans-serif',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'auto',
  cursor: 'default',
  maxHeight: '536px'

};

type WrapperProps = {

  ref: React.RefObject<React.Component>;
  offset: {

    x: number;
    y: number;

  }

};

class ComponentWrapper extends React.Component<WrapperProps> {

  initialOffset: CSSProperties;

  constructor(props: WrapperProps) {

    super(props);

    this.initialOffset = Object.create(DIV2);    

  }

  render() {

    console.log('[DEV][reactmap][ComponentWrapper] Initial offset => ', this.initialOffset.left, this.initialOffset.top);
    console.log('[DEV][reactmap][ComponentWrapper] Props offset => ', this.props.offset);

    this.initialOffset.position = 'absolute';
    this.initialOffset.left = this.props.offset.x;
    this.initialOffset.top = this.props.offset.y;

    return(      
      <div className="base" style={DIV1}>
        <div className="offset" style={this.initialOffset}>
          <div className="" style={DIV3}>
            <div role="dialog" tabIndex={-1} className="" style={DIV4}>
              <div className="component-container" style={DIV5}>

                {this.props.children}

              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }

}

export default ComponentWrapper;