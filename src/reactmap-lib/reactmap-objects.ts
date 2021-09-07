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

  constructor(componentWrapper: React.RefObject<React.Component>, refWrapper: React.RefObject<HTMLDivElement>) {

    this.componentWrapper = componentWrapper;
    this.refWrapper = refWrapper;

    this.offsetDiv = refWrapper.current!.querySelector('div.offset') as HTMLDivElement;
    this.childComponentDiv = refWrapper.current!.querySelector('div.component-container') as HTMLDivElement;

  }

  logRefs() {

    console.log('[DEV][reactmap-objects] I am component => ', this.componentWrapper);
    console.log('[DEV][reactmap-objects] And my ref is => ', this.refWrapper);

  }

}