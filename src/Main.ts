import Editor from "./Editor";
import RenderView from "./RenderView";
const THREE = require("three");
import { timer } from "d3-timer";

/**
 * timer for transition
 */
window.d3 = {};
window.d3.timer = timer;

/**
 * initialize RenderView
 */
const renderView = new RenderView();
new Editor(renderView);

/**
 * global context
 */
window.port = renderView.port;
window.THREE = THREE;

// we should consider map three/examples codes to gloabal.
const {
  BloomEffect,
  NoiseEffect,
  BokehEffect,
  DepthEffect
} = require("postprocessing");
window.THREE.BloomEffect = BloomEffect;
window.THREE.NoiseEffect = NoiseEffect;
window.THREE.BokehEffect = BokehEffect;
window.THREE.DepthEffect = DepthEffect;
