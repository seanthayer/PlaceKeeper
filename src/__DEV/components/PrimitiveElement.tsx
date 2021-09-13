import React from "react";

class PrimitiveElement extends React.Component {

  render() {

    return(
      <h1 onClick={() => console.log('hey')}>Hello</h1>
    );

  }

}

export default PrimitiveElement;