import { Scene, Mesh, Texture, Object3D, WebGLRenderTarget } from "three";

// interface TextureNode {}
// interface EffectNode {}
// interface RendererTaregtNode {}

export type YNode = Object3D | Mesh | Texture;

export type Port = {
  scene: Scene;
  renderers: Array<{ target: WebGLRenderTarget; scene: Scene }>;
};
