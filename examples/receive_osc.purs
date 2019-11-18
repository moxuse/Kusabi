-- Receive OSC from onther application and set uniform value.

add =<< uOsc "/x" "density" <$> noisePlane

{-
  Binding `density` uniform value to `/x` address of OSC Message.

  Default listening port is 5000. It can chanege by config.json.
  
  Then send message like..
  
  ` sendMsg ["/x", 0.25] `
  
  in sender application.
    
  Using 'apply operator' function (|>), You can write like this.
-}

add =<< noisePlane |> uOsc "/x" "density"
