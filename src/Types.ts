import { Scene, Mesh, Texture, Object3D } from "three";

// interface TextureNode {}
// interface EffectNode {}
// interface RendererTaregtNode {}

export type YNode = Object3D | Mesh | Texture;

export type Port = { scene: Scene };
