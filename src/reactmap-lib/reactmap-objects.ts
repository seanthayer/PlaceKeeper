import React from 'react';
import reactmap from 'reactmap-lib';

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

  origin: reactmap.Point;
  offset: reactmap.Point;

  constructor(
    componentWrapper: React.RefObject<React.Component>,
    refWrapper: React.RefObject<HTMLDivElement>,
    origin: reactmap.Point,
    offset: reactmap.Point
    ) {

    this.componentWrapper = componentWrapper;
    this.refWrapper = refWrapper;

    this.offsetDiv = refWrapper.current!.querySelector('div.offset') as HTMLDivElement;
    this.childComponentDiv = refWrapper.current!.querySelector('div.component-container') as HTMLDivElement;

    this.origin = origin;
    this.offset = offset;

  }

  logMetadata() {

    console.log('[DEV][reactmap-objects] I am component => ', this.componentWrapper);
    console.log('[DEV][reactmap-objects] And my ref is => ', this.refWrapper);
    console.log('[DEV][reactmap-objects] My origin point is => ', this.origin);
    console.log('[DEV][reactmap-objects] My offset is => ', this.offset);

  }

}