import { Port } from "./Types";
import {
  Scene,
  Object3D,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderingContext,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  Color,
  PCFShadowMap,
  DirectionalLight,
  WebGLRenderTarget
} from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";

class RenderView {
  private camera: PerspectiveCamera;
  private cameraForRenderTargets: OrthographicCamera;
  private scene: Scene = new Scene();
  private rotateScene: Object3D = new Object3D();
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
    // this.renderer.shadowMapCullFace = CullFaceBack;
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFShadowMap;

    el.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 100);
    this.cameraForRenderTargets = new OrthographicCamera(
      -1.0,
      -1.0,
      1.0,
      1.0,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);
    this.cameraForRenderTargets.position.set(0, 0, 4);

    this.scene.background = new Color(0xffffff);

    this.scene.add(this.rotateScene);

    this.intiLight();
    return { targets: [], scene: this.rotateScene };
  }

  intiLight() {
    const ambientLight = new AmbientLight(0x2e9992);
    ambientLight.tag = "light";
    this.scene.add(ambientLight);

    var directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.castShadow = true;
    directionalLight.tag = "light";
    this.scene.add(directionalLight);

    let lights = [];
    lights[0] = new PointLight(0xffffff, 1, 0);
    lights[0].castShadow = true;
    lights[0].shadowDarkness = 0.5;
    lights[0].shadow.camera.near = 0.001;
    lights[0].shadow.camera.far = 50;
    lights[1] = new PointLight(0xffffff, 1, 0);
    lights[0].tag = "light";
    lights[1].tag = "light";
    lights[0].position.set(0, 25, 0);
    lights[1].position.set(-25, -30, -25);
    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
  }

  render() {
    if (window.port && 0 < window.port.targets.length) {
      for (let current of window.port.targets) {
        this.renderer.setClearColor(new Color(0x000000), 1.0);
        this.renderer.setRenderTarget(current.target);
        this.renderer.render(current.scene, this.cameraForRenderTargets);
      }
    }
    this.renderer.setRenderTarget(null);

    this.renderer.setClearColor(new Color(0x000000), 1.0);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.rotateScene.rotation.x += 0.005;
    this.rotateScene.rotation.y += 0.005;
    if (window.port && 0 < window.port.targets.length) {
      // for (let current of window.port.targets) {
      //   current.scene.rotation.x += 0.005;
      //   current.scene.rotation.y += 0.005;
      // }
    }
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  public cleanPort() {
    for (let trg of window.port.targets) {
      this.cleanScen(trg.scene);
      trg.scene = null;
      this.cleanRenderTarget(trg.target);
      const index = window.port.targets.indexOf(trg);
      window.port.targets.splice(index, 1);
    }
    this.cleanScen(window.port.scene);
  }

  cleanRenderTarget(target: WebGLRenderTarget) {
    // console.log("clean 3", target);
    target.dispose();
    target = null;
  }

  cleanScen(scene: Scene) {
    // console.log("clean 4", scene);
    if (!scene) {
      return;
    }
    for (var i = 0; i < scene.children.length; i++) {
      // console.log("clean 5", scene.children[i]);
      if ("light" != scene.children[i].tag) {
        if (scene.children[i].material.map) {
          scene.children[i].material.map.dispose();
        }
        scene.children[i].material.dispose();
        // console.log("clean 6", scene.children[i]);
        scene.children[i].geometry.dispose();
        scene.remove(scene.children[i]);
      }
    }
  }
}

export default RenderView;
