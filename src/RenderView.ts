import { Port, postEffectsPortProxy } from "./Types";
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
  Vector3,
  DirectionalLight,
  WebGLRenderTarget
} from "three";
import { EffectComposer, EffectPass, RenderPass } from "postprocessing";

import { WEBGL } from "three/examples/jsm/WebGL.js";
const config = require("../config.json");

class RenderView {
  private camera: PerspectiveCamera;
  private cameraForRenderTargets: OrthographicCamera;
  private scene: Scene = new Scene();
  private rotateScene: Object3D = new Object3D();
  private renderer: WebGLRenderer;
  private width: number;
  private height: number;
  private effectComposer: EffectComposer;
  private elapse: number;
  public port: Port;

  constructor() {
    this.port = this.init();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.elapse = 0;
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

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      context: context,
      antialias: true
    });
    this.renderer.shadowMapEnabled = true;
    // this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.shadowMapCullFace = CullFaceBack;
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFShadowMap;

    el.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      20.0
    );
    this.cameraForRenderTargets = new OrthographicCamera(
      -1.0,
      -1.0,
      1.0,
      1.0,
      0.1,
      10.0
    );
    this.camera.position.set(0, 0.45, 5);
    this.cameraForRenderTargets.position.set(0, 0, 5);
    this.camera.lookAt(new Vector3(0.0, 0.0, 0.0));

    this.scene.background = new Color(
      parseInt(config.renderView.backgroundColor)
    );

    this.scene.add(this.rotateScene);

    this.intiLight();

    window.addEventListener("resize", this.onResize.bind(this), false);
    this.onResize();

    const postEffects = [];
    let postEffects_;
    if (config.renderView.postProcessing) {
      this.effectComposer = new EffectComposer(this.renderer);
      // observer for postEffects changes
      postEffects_ = postEffectsPortProxy(postEffects, (target, length) => {
        if (0 < length) {
          this.updatePostProcessing();
        }
      });

      // timer for postEffects
      window.d3.timer(elapse => {
        this.elapse = elapse;
      });
    }
    return {
      targets: [],
      scene: this.rotateScene,
      postEffects: postEffects_,
      onRender: []
    };
  }

  updatePostProcessing() {
    if (!config.renderView.postProcessing) {
      return;
    }
    this.port.postEffects.forEach(e => {
      console.log("append effect pass", e);
      const renderPass = new RenderPass(this.scene, this.camera);
      const pass = new EffectPass(this.camera, e.effect);
      pass.renderToScreen = e.renderToScreen;
      this.effectComposer.addPass(renderPass);
      this.effectComposer.addPass(pass);
    });
  }

  intiLight() {
    const ambientLight = new AmbientLight(config.renderView.ambientLightColor);
    ambientLight.tag = "light";
    this.scene.add(ambientLight);

    var directionalLight = new DirectionalLight(
      config.renderView.lightColor,
      0.5
    );
    directionalLight.castShadow = true;
    directionalLight.tag = "light";
    this.scene.add(directionalLight);

    let lights = [];
    lights[0] = new PointLight(config.renderView.lightColor, 1, 0);
    lights[0].castShadow = true;
    lights[0].shadowDarkness = 0.5;
    lights[0].shadow.camera.near = 0.001;
    lights[0].shadow.camera.far = 50;
    lights[1] = new PointLight(config.renderView.lightColor, 1, 0);
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
        // if (current.target.tag && current.target.tag === "postEffect") {
        // this.renderer.render(current.scene, this.cameraForRenderTargets);
        // } else {
        if (!current.skip) {
          this.renderer.setClearColor(new Color(0x000000), 0.0);
          this.renderer.setRenderTarget(current.target);
          this.renderer.render(current.scene, this.cameraForRenderTargets);
        }
        // } else {
        // console.log(current.target.texture.uuid);
        // }
        // }
      }
    }
    this.renderer.setRenderTarget(null);

    this.renderer.setClearColor(new Color(0x000000), 0.0);
    this.renderer.render(this.scene, this.camera);

    if (config.renderView.postProcessing && this.effectComposer && window.d3) {
      this.effectComposer.render(this.elapse);
    }

    if (window.port && window.port.onRender) {
      window.port.onRender.forEach(o => {
        o(this.renderer, this.scene);
      });
    }
  }

  animate() {
    if (config.renderView.cameraRotation) {
      this.rotateScene.rotation.x += 0.005;
      this.rotateScene.rotation.y += 0.005;
    }
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
    while (0 < window.port.targets.length) {
      const len = window.port.targets.length;
      const target = window.port.targets[len - 1];

      this.cleanScen(target.scene);
      target.scene = null;

      this.cleanRenderTarget(target.target);
      const index = window.port.targets.indexOf(target);
      // console.log(index, window.port.targets);

      window.port.targets.splice(index, 1);
    }
    this.cleanScen(window.port.scene);
    this.cleanPostProcessing();
    this.clearOnRender();
  }

  cleanRenderTarget(target: WebGLRenderTarget) {
    target.dispose();
    target = null;
  }

  cleanScen(scene: Scene) {
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

  cleanPostProcessing() {
    if (config.renderView.postProcessing) {
      if (window.port.postEffects && window.port.postEffects.length > 0) {
        window.port.postEffects.forEach(e => {
          this.effectComposer.removePass(e.effect);
          e.effect.dispose();
          const index = window.port.postEffects.indexOf(e);
          // console.log(index, window.port.postEffects);

          window.port.postEffects.splice(index, 1);
          e.effect = null;
        });
      }
    }
  }

  clearOnRender() {
    if (window.port.onRender) {
      // console.log(window.port.onRender, window.port.onRender.length);
      window.port.onRender.forEach(o => {
        const index = window.port.onRender.indexOf(o);
        window.port.onRender[index] = null;
      });
      window.port.onRender = [];
    }
  }

  onResize(e) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
}

export default RenderView;
