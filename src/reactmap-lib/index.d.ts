/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from "react";

/* ------------------------------------------
 *
 *                DECLARATIONS
 * 
 * ------------------------------------------
 */


export = reactmap;
export as namespace reactmap;

declare namespace reactmap {

  type Point = {

    x: number;
    y: number;

  }

  type LatLng = {

    lat: number;
    lng: number;

  }

  // interface MapComponent {

  //   componentWrapper: React.RefObject<React.Component>;
  //   refWrapper:       React.RefObject<HTMLDivElement>;

  // }

}