import { Scene, Mesh, Texture, Object3D, WebGLRenderTarget } from "three";

// interface TextureNode {}
// interface EffectNode {}
// interface RendererTaregtNode {}

// export type YodakaNode = Object3D | Mesh | Texture;

export type Port = {
  scene: Scene;
  targets: Array<{ target: WebGLRenderTarget; scene: Object3D }>;
};
