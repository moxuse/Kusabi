-- Set uniform value

add =<< sU "density" 1.5 <$> noisePlane

-- Or using 'apply operator' function (|>), You can write like this.

add =<< noisePlane |> sU "density" 1.5

-- Using 'combine operator' function (|+), You can chain operators like this.

add =<< noisePlane |> sU "density" 1.5 |+ uUE "time"
