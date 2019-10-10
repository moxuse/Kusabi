t1 <- render noisePlane
t2 <- render normalPlane
t3 <- render noisePlane
velocity <- fbRender "base" $ advectPlane t2 t1
dt<- render =<< uU "deltaT" <$> divergencePlane velocity
pt <- render noisePlane
pressure <- fbRender "pressure" $ jacobiPlane dt pt
sub <- fbRender "velocity" (subtractGradientPlane velocity pressure)
velocity2 <- fbRender "base" $ advectPlane pressure sub
add $ mapPlane $ substructGradientPlane velocity pressure
add $ mapPlane sub