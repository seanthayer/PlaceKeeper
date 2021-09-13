import React, { CSSProperties } from 'react';

import RenderedComponent from './RenderedComponent';
import type { RenderProps } from './RenderedComponent';
import reactmap from 'reactmap-lib';


type RenderElement = React.ReactElement<RenderProps>;

type LayerProps = {

  parentDiv: HTMLDivElement;
  hostDiv: HTMLDivElement;

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

  finalTransform: reactmap.Point;

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

  }

  render() {

    return(

      <div ref={this.layerRef} id="reactmap-render-layer" style={this.layerStyle}>

        {this.state.renderElements}

      </div>

    );

  }

  componentDidMount() {

    console.log('[DEV][reactmap][RenderLayer] Logging metadata: ');
    console.log('[DEV][reactmap][RenderLayer] -- parentDiv => ', this.parentDiv);
    console.log('[DEV][reactmap][RenderLayer] -- hostDiv => ', this.hostDiv);

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

  addRender(cClass: React.ComponentClass, offset: reactmap.Point) {

    this.setState((prevState) => {

      const COMPONENT_KEY = (

        ((offset.x + offset.y) + Math.random() + 0.1) * (Math.random() + 0.1)

      );

      let ref = React.createRef<RenderedComponent>();

      console.log('[DEV][reactmap][RenderLayer] COMPONENT_KEY => ', COMPONENT_KEY);   

      let newRenderElements = Array.from(prevState.renderElements);
      let element = React.createElement(cClass);
      let render = React.createElement(RenderedComponent, { key: COMPONENT_KEY, ref: ref, initialOffset: offset, __DEBUG__Origin: offset }, element);

      console.log('[DEV][reactmap][RenderLayer] Previous state => ', prevState);
      console.log('[DEV][reactmap][RenderLayer] Adding render => ', render);

      newRenderElements.push(render);
      this.renderRefs.push(ref);

      return { renderElements: newRenderElements };

    }, () => console.log('[DEV][reactmap][RenderLayer] Render instances => ', this.renderRefs));

  }

  offsetRenderedComponents(x: number, y: number) {

    this.renderRefs.forEach((r) => {
  
      r.current!.adjustOffset(x, y);
  
    });

  }

  mimicHost() {

    this.layerRef.current!.style.willChange = 'transform';

    this.hostObserver = new MutationObserver(() => {

      let prevTransformX: number | string;
      let prevTransformY: number | string;

      let transformX: number | string;
      let transformY: number | string;

      // [ prevTransformX, prevTransformY ] = this.__parseStyleTransform(this.layerRef.current!.style.transform);

      // [ prevTransformX, prevTransformY ] = this.layerRef.current!.style.transform.match(matchXorY)!;

      [ transformX, transformY ] = this.__parseStyleTransform(this.hostStyle.transform);

      // - - - -

      // [ prevTransformX, prevTransformY ] = [ parseInt(prevTransformX), parseInt(prevTransformY) ];
      // [ transformX, transformY ]         = [ parseInt(transformX), parseInt(transformY) ];

      //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // | EDGE CASE:   The case in which a user drags away from an origin point and directly back is very unlikely, and |
      // |              difficult to accomplish even given an active read-out of the current transform values.           |
      // |                                                                                                               |
      // | Nonetheless, in this case the 'finalTransform' will have 'x || y == -1 || 1', causing a 1 pixel inaccuracy    |
      // |              when adjusting offset for all rendered components.                                               |
      //  - - - - - -       - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //             \    /
      //              \  /
      //               \/
      if ( (transformX + transformY) !== 0) {

        // console.log('[DEV][reactmap][RenderLayer] transformX, transformY => ', transformX, transformY);



        console.warn('[DEV][reactmap][RenderLayer] Observing,');

        this.layerRef.current!.style.transform = `translate(${transformX}px, ${transformY}px)`;

        this.finalTransform = { x: transformX, y: transformY };

        console.log('[DEV][reactmap][RenderLayer] this.finalTransform => ', this.finalTransform);

      } else {

        // console.warn('[DEV][reactmap][RenderLayer] Discarding zero transform. . .');

      }

    });

    this.hostObserver.observe(this.hostDiv, { attributes: true });

  }

  stopMimic() {

    console.warn('[DEV][reactmap][RenderLayer] Finishing observation,');

    console.log('[DEV][reactmap][RenderLayer] this.finalTransform => ', this.finalTransform);

    this.offsetRenderedComponents((this.finalTransform.x * -1), (this.finalTransform.y * -1));

    this.layerRef.current!.style.willChange = 'auto';
    this.layerRef.current!.style.transform = 'translate(0px, 0px)';

    this.__disconnectObserver();

  }

  private __disconnectObserver() {

    this.hostObserver && this.hostObserver.disconnect();
    this.hostObserver = null;

  }

  genericMethod() {

    console.log('[DEV][reactmap][RenderLayer] Hey there');

  }

}

export default RenderLayer;