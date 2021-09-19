/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React, { CSSProperties } from 'react';

import RenderedComponent from './RenderedComponent';
import type { RenderProps } from './RenderedComponent';

import ReactMap from 'reactmap';

/* ------------------------------------------
 *
 *               RENDER LAYER
 * 
 * ------------------------------------------
 */

type RenderElement = React.ReactElement<RenderProps>;

type LayerProps = {

  parentDiv: HTMLDivElement;
  hostDiv: HTMLDivElement;

  mapZoom: number;

};

type LayerState = {

  renderElements: RenderElement[];

}

class RenderLayer extends React.PureComponent<LayerProps, LayerState> {

  layerRef: React.RefObject<HTMLDivElement>;
  layerStyle: CSSProperties;

  parentDiv: HTMLDivElement;
  hostDiv: HTMLDivElement;

  hostStyle: CSSStyleDeclaration;
  hostObserver: MutationObserver | null;

  renderRefs: React.RefObject<RenderedComponent>[];

  finalTransform: ReactMap.Point;

  currZoom: number;

  constructor(props: LayerProps) {

    super(props);

    this.state = {
      
      renderElements: []
    
    }

    this.layerStyle = {

      zIndex: 5,
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '100%',
      transform: 'translate(0px, 0px)',
      willChange: 'auto'

    }

    this.layerRef = React.createRef<HTMLDivElement>();

    this.parentDiv = this.props.parentDiv;
    this.hostDiv = this.props.hostDiv;

    this.hostStyle = window.getComputedStyle(this.hostDiv);
    this.hostObserver = null;

    this.renderRefs = [];

    this.finalTransform = { x: 0, y: 0 };

    this.currZoom = this.props.mapZoom;

  }

  render() {

    return(

      <div ref={this.layerRef} id="reactmap-render-layer" style={this.layerStyle}>

        {this.state.renderElements}

      </div>

    );

  }

  componentDidMount() {

    console.log('[DEV][ReactMap][RenderLayer] Logging metadata: ');
    console.log('[DEV][ReactMap][RenderLayer] -- parentDiv => ', this.parentDiv);
    console.log('[DEV][ReactMap][RenderLayer] -- hostDiv => ', this.hostDiv);

  }

  private __parseStyleTransform(transform: string): [ number, number ] {

    let x: number;
    let y: number;

    let type = transform.match(/^\w+/g)![0];

    let matchXandY = /-?\d+, -?\d+(?=\))/g;
    let matchXorY = /-?\d+/g;
    let intermediary: string;

    switch (type) {

      case 'transform':

        [ x, y ] = transform.match(matchXorY)!.map((s) => parseInt(s));
        
      break;

      case 'matrix':

        intermediary = transform.match(matchXandY)![0];

        [ x, y ] = intermediary.match(matchXorY)!.map((s) => parseInt(s));

      break;
    
      default:

        x = 0;
        y = 0;

      break;

    }

    return [ x, y ]

  }

  addRender(cClass: React.ComponentClass, offset: ReactMap.Point, origin: ReactMap.Point) {

    this.setState((prevState) => {

      const COMPONENT_KEY = (

        ((offset.x + offset.y) + Math.random() + 0.1) * (Math.random() + 0.1)

      );

      let ref = React.createRef<RenderedComponent>();

      console.log('[DEV][ReactMap][RenderLayer] COMPONENT_KEY => ', COMPONENT_KEY);

      let newRenderElements = Array.from(prevState.renderElements);
      let element = React.createElement(cClass);
      let render = React.createElement(RenderedComponent, { key: COMPONENT_KEY, ref: ref, initialOffset: offset, worldOrigin: origin }, element);

      console.log('[DEV][ReactMap][RenderLayer] Previous state => ', prevState);
      console.log('[DEV][ReactMap][RenderLayer] Adding render => ', render);

      newRenderElements.push(render);
      this.renderRefs.push(ref);

      return { renderElements: newRenderElements };

    }, () => console.log('[DEV][ReactMap][RenderLayer] Render instances => ', this.renderRefs));

  }

  offsetRenderedComponents(x: number, y: number) {

    this.renderRefs.forEach((r) => {
  
      r.current!.adjustOffset(x, y);
      console.log(`[DEV][ReactMap][RenderLayer] offset left: ${x}, top: ${y}`);
  
    });

  }

  doZoomTransform(
    mapPixelCenter: ReactMap.Point,
    newZoom: number,
    calcPixelCoord: (worldCoord: ReactMap.Point, zoom: number) => ReactMap.Point,
  ) {

    let scaledRenderOrigin: ReactMap.Point;

    let distX: number;
    let distY: number;

    let direction: 'in' | 'out' = (this.currZoom < newZoom ? 'in' : 'out');

    console.log('[DEV][ReactMap][RenderLayer] Doing zoom transform,');
    // console.log('[DEV][ReactMap][RenderLayer] -- Map center => ', mapPixelCenter);

    this.renderRefs.forEach((r, i) => {

      scaledRenderOrigin = calcPixelCoord(r.current!.worldOrigin, newZoom);

      distX = scaledRenderOrigin.x - mapPixelCenter.x;
      distY = scaledRenderOrigin.y - mapPixelCenter.y;

      console.log(`[DEV][ReactMap][RenderLayer] -- Render #${i},`);
      console.log('[DEV][ReactMap][RenderLayer] ---- World origin => ', r.current!.worldOrigin);
      console.log('[DEV][ReactMap][RenderLayer] ---- Pixel origin => ', scaledRenderOrigin);
      console.log(`[DEV][ReactMap][RenderLayer] ---- Distance from map center => (${distX}, ${distY})`);

      // console.log('[DEV][ReactMap][RenderLayer] ---- Smoothing offset. . .');

      r.current!.smoothOffset(distX, distY, direction);

    });

    this.currZoom = newZoom;

    // - - - -

    /* - - - - BAD SOLUTION - - - -
    
    let direction: 'in' | 'out';

    let minZoom = exportConstants.MIN_ZOOM;
    let maxZoom = exportConstants.MAX_ZOOM;

    if (  ((minZoom < this.currZoom) && (this.currZoom < maxZoom)) ||
          ((minZoom < newZoom) && (newZoom < maxZoom))) {

      direction = (this.currZoom < newZoom ? 'in' : 'out');

      this.renderRefs.forEach((r) => {
  
        r.current!.doZoom(direction);
  
      });
  
      this.currZoom = newZoom;
      
    } else {

      console.warn('[DEV][ReactMap][RenderLayer] Discarding duplicate zoom at level => ', newZoom);

    }
    */

  }

  mimicHost() {

    console.log('[DEV][ReactMap][RenderLayer] Mimicking');

    this.layerRef.current!.style.willChange = 'transform';

    this.hostObserver = new MutationObserver(() => {

      let transformX: number | string;
      let transformY: number | string;

      [ transformX, transformY ] = this.__parseStyleTransform(this.hostStyle.transform);

      //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // | EDGE CASE:   The case in which a user drags away from an origin point and directly back is very unlikely, and |
      // |              difficult to accomplish even given an active read-out of the current transform values.           |
      // |              Nonetheless,                                                                                     |
      // |              In this case the 'finalTransform' will have 'x || y == -1 || 1', causing a 1 pixel inaccuracy    |
      // |              when adjusting offset for all rendered components.                                               |
      //  - - - - - -       - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //             \    /
      //              \  /
      //               \/
      if ( (transformX + transformY) !== 0) {

        this.layerRef.current!.style.transform = `translate(${transformX}px, ${transformY}px)`;

        this.finalTransform = { x: transformX, y: transformY };

        // console.log('[DEV][ReactMap][RenderLayer] this.finalTransform => ', this.finalTransform);

      } else {

        // console.warn('[DEV][ReactMap][RenderLayer] Discarding zero transform. . .');

      }

    });

    this.hostObserver.observe(this.hostDiv, { attributes: true , attributeFilter: ['style'] });

  }

  stopMimicking() {

    console.log('[DEV][ReactMap][RenderLayer] Stopping mimic,');

    // this.__DEBUG__PrintRenderOffsets();

    this.offsetRenderedComponents((this.finalTransform.x * -1), (this.finalTransform.y * -1));
    
    // this.__DEBUG__PrintRenderOffsets();

    this.layerRef.current!.style.willChange = 'auto';
    this.layerRef.current!.style.transform = 'translate(0px, 0px)';

    this.__disconnectObserver();

  }

  freezeRenderTransitions() {

    this.renderRefs.forEach((r) => {

      r.current!.freezeTransition();

    })

  }

  recalculateRenderPositions(
    mapPixelCenter: ReactMap.Point,
    newZoom: number,
    calcPixelCoord: (worldCoord: ReactMap.Point, zoom: number) => ReactMap.Point
    ) {

    let scaledRenderOrigin: ReactMap.Point;

    let distX: number;
    let distY: number;

    this.renderRefs.forEach((r) => {

      scaledRenderOrigin = calcPixelCoord(r.current!.worldOrigin, newZoom);

      distX = scaledRenderOrigin.x - mapPixelCenter.x;
      distY = scaledRenderOrigin.y - mapPixelCenter.y;

      r.current!.__DEBUG__Offset(distX, distY);

    });

  }

  // __DEBUG__PrintRenderOffsets() {

  //   console.log('[DEV][ReactMap][RenderLayer] Printing offsets,');

  //   this.renderRefs.forEach((r) => {

  //     r.current!.__DEBUG__PrintOffset();

  //   });

  // }

  private __disconnectObserver() {

    this.hostObserver && this.hostObserver.disconnect();
    this.hostObserver = null;

  }

}

export default RenderLayer;