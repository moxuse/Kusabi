import { Scene, Object3D, WebGLRenderTarget } from "three";
import { Effect } from "postprocessing";

export type Port = {
  scene: Scene;
  targets: Array<{ target: WebGLRenderTarget; scene: Object3D }>;
  postEffects: Array<{ effect: Effect; renderToScreen: Boolean }>;
  osc: WebSocket;
};

export function postEffectsPortProxy(
  array: Array<{ effect: Effect; renderToScreen: Boolean }>,
  callback: (
    target: { effect: any; renderToScreen: Boolean }[],
    length: number
  ) => void
) {
  const p = new Proxy(array, {
    deleteProperty: (target, property) => {
      return Reflect.deleteProperty(target, property);
    },
    set: (target, property, val, receiver) => {
      callback(target, target.length);
      return Reflect.set(target, property, val, receiver);
    }
  });
  return p;
}
