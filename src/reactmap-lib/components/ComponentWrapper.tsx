import React, { CSSProperties } from "react";

const DIV1: CSSProperties = {

  fontWeight: 400,
  fontSize: '11px',
  fontFamily: 'Roboto, Arial, sans-serif',
  cursor: 'default',
  position: 'absolute',
  top: '0px',
  left: '0px',
  zIndex: 0

};

const DIV2: CSSProperties = {

  fontWeight: 400,
  fontSize: '11px',
  fontFamily: 'Roboto, Arial, sans-serif',
  cursor: 'default',
  position: 'absolute',
  width: '9999px',
  height: 0

};

const DIV3: CSSProperties = {

  fontWeight: 400,
  fontSize: '11px',
  fontFamily: 'Roboto, Arial, sans-serif',
  cursor: 'default',
  position: 'absolute',
  width: '100%',
  right: '0px',
  bottom: '0px'

};

const DIV4: CSSProperties = {

  fontWeight: 300,
  fontSize: '13px',
  fontFamily: 'Roboto, Arial, sans-serif',
  cursor: 'default',
  position: 'absolute',
  overflow: 'hidden',
  top: 0,
  left: 0,
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

  render() {

    let initialOffset = DIV2;

    initialOffset.left = this.props.offset.x;
    initialOffset.top = this.props.offset.y;

    return(      
      <div style={DIV1}>
        <div className="offset" style={initialOffset}>
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