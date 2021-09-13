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

  // type Transform = {

  //   top: number | string;
  //   left: number | string;

  // }

  // interface MapComponent {

  //   componentWrapper: React.RefObject<React.Component>;
  //   refWrapper:       React.RefObject<HTMLDivElement>;

  // }

}