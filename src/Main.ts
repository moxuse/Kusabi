import Editor from "./Editor";
import RenderView from "./RenderView";
const THREE = require("three");
import { timer } from "d3-timer";

const renderView = new RenderView();
new Editor(renderView);

// global context
window.port = renderView.port;
window.THREE = THREE;

// we should consider map three/examples codes to gloabal.
// require("three/examples/js/shaders/BokehShader.js");

/**
 * timer for transition
 */
window.d3 = {};
window.d3.timer = timer;
