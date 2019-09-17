target <- torus {}
tColor <- renderPath target
clone <- cloneDepthRenderable target
tDepth <- renderPath clone
add $ makeBokehPlane tColor tDepth