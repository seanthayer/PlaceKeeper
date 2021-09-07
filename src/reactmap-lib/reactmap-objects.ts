import React from 'react';

/* ------------------------------------------
 *
 *                  CLASSES
 * 
 * ------------------------------------------
 */

export class RenderedComponent {

  componentWrapper: React.RefObject<React.Component>;
  refWrapper:       React.RefObject<HTMLDivElement>;

  offsetDiv: HTMLDivElement;
  childComponentDiv: HTMLDivElement;

  origin: google.maps.Point;
  centerToOrigin: { x: number, y: number };

  constructor(
    componentWrapper: React.RefObject<React.Component>,
    refWrapper: React.RefObject<HTMLDivElement>,
    origin: google.maps.Point,
    offset: { x: number, y: number }
    ) {

    this.componentWrapper = componentWrapper;
    this.refWrapper = refWrapper;

    this.offsetDiv = refWrapper.current!.querySelector('div.offset') as HTMLDivElement;
    this.childComponentDiv = refWrapper.current!.querySelector('div.component-container') as HTMLDivElement;

    this.origin = origin;
    this.centerToOrigin = offset;

  }

  logMetadata() {

    console.log('[DEV][reactmap-objects] I am component => ', this.componentWrapper);
    console.log('[DEV][reactmap-objects] And my ref is => ', this.refWrapper);
    console.log('[DEV][reactmap-objects] My origin point is => ', this.origin);
    console.log('[DEV][reactmap-objects] From center to origin is => ', this.centerToOrigin);

  }

}