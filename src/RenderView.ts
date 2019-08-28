import { Port } from "./Types";
import {
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderingContext,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  Color
} from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";

class RenderView {
  private camera: PerspectiveCamera;
  private cameraForRenderTargets: OrthographicCamera;
  private scene: Scene = new Scene();
  private renderer: WebGLRenderer;
  private width: number;
  private height: number;
  public port: Port;

  constructor() {
    this.port = this.init();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.animate();
  }

  init(): Port {
    if (WEBGL.isWebGL2Available() === false) {
      document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
    }

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const canvas = document.createElement("canvas");
    const context: WebGLRenderingContext = canvas.getContext("webgl2");
    const el = document.getElementById("renderView");

    this.renderer = new WebGLRenderer({ canvas: canvas, context: context });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer = new WebGLRenderer({ canvas: canvas, context: context });
    el.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      1000
    );
    this.cameraForRenderTargets = new OrthographicCamera(-1, -1, 1, 1, 0.1, 20);
    this.camera.position.set(0, 0, 10);
    this.cameraForRenderTargets.position.set(0, 0, 20);

    this.scene.background = new Color(0xffffff);

    this.intiLight();
    return { renderers: [], scene: this.scene };
  }

  intiLight() {
    const ambientLight = new AmbientLight(0x2e9992);
    ambientLight.tag = "light";
    this.scene.add(ambientLight);

    let lights = [];
    lights[0] = new PointLight(0xffffff, 1, 0);
    lights[1] = new PointLight(0xffffff, 1, 0);
    lights[2] = new PointLight(0xffffff, 1, 0);
    lights[0].tag = "light";
    lights[1].tag = "light";
    lights[2].tag = "light";

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  }

  render() {
    // this.renderer.setClearColor(new Color(0x000000), 1.0);
    if (0 < this.port.renderers.length) {
      for (let current of this.port.renderers) {
        this.renderer.setRenderTarget(current.target);
        this.renderer.render(current.scene, this.cameraForRenderTargets);

        // this.renderer.setClearColor(new Color(0x000000), 1.0);
        // this.renderer.render(current.scene, this.camera);
      }
    }

    this.renderer.setClearColor(new Color(0x000000), 1.0);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.scene.rotation.x += 0.005;
    this.scene.rotation.y += 0.005;
    for (let current of this.port.renderers) {
      current.scene.rotation.x += 0.005;
      current.scene.rotation.y += 0.005;
    }
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
}

export default RenderView;
