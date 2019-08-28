import { Port } from "./Types";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  Color
} from "three";

class RenderView {
  private camera: PerspectiveCamera;
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
    this.renderer = new WebGLRenderer({});
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);
    const el = document.getElementById("renderView");
    el.appendChild(this.renderer.domElement);

    this.scene.background = new Color(0xffffff);

    this.intiLight();
    return { scene: this.scene };
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
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.scene.rotation.x += 0.005;
    this.scene.rotation.y += 0.005;

    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
}

export default RenderView;
