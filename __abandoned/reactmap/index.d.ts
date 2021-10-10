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


export = ReactMap;
export as namespace ReactMap;

declare namespace ReactMap {

  type Point = {

    x: number;
    y: number;

  }

  type LatLng = {

    lat: number;
    lng: number;

  }

}