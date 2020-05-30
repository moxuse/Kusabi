import { timer } from "d3-timer";
import RenderView from "./RenderView";
const crypto = require('crypto-browserify');

/**
 * timer for transition
 */
window.d3 = {};
window.d3.timer = timer;

/**
  * initialize RenderView
 */
const renderView = new RenderView();

if (!process.env.NODE_ENV || process.env.NODE_ENV != "export") {
  import("./Editor").then(Editor => {
    new Editor.default(renderView);
  });
}

/**
 * global context
 */ 
window.port = renderView.port;
window.port.crypto = crypto;
if (!process.env.NODE_ENV || process.env.NODE_ENV != "export") { 
  import("three").then(THREE => {
    window.THREE = THREE;
    console.log("three version ::", THREE.REVISION);
    // we should consider map three/examples codes to global. a compromise code.    
    import("postprocessing").then(({
      BloomEffect,
      NoiseEffect,
      BokehEffect,
      DepthEffect
    }) => {
      
      // TODO : didnt import web export mode

      window.THREE.BloomEffect = BloomEffect;
      window.THREE.NoiseEffect = NoiseEffect;
      window.THREE.BokehEffect = BokehEffect;
      window.THREE.DepthEffect = DepthEffect;
    })

  })
}

