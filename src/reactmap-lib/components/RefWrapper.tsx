import React from "react";

// type RefProps = { latLng: google.maps.LatLng };

const RefWrapper = React.forwardRef<HTMLDivElement>((props, ref) => (

  <div ref={ref}>

    {props.children}

  </div>

));

export default RefWrapper;