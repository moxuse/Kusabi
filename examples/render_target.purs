-- WebGLRenderTarget as a texture map

tex <- render noisePlane

torus $ sphere {
  normalMap: tex
}
