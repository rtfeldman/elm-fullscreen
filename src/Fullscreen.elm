module Fullscreen where
{-| Elm bindings to HTML5 Fullscreen API.

-}

import Signal
import Task exposing (Task)

import Native.Fullscreen


{-|
  * Active - The page is currently in Fullscreen Mode.
  * RequestAvailable - The page is in a state where Fullscreen Mode can be requested.
  * RequestUnvailable - The page is not a state where Fullscreen Mode can be requested.
  * Unsupported - This browser does not support the Fullscreen API.
-}
type Status
  = Active
  | RequestAvailable
  | RequestUnavailable
  | Unsupported


{-|
A signal of Booleans representing whether Fullscreen Mode is active. It begins
False and switches to True or False as appropriate whenever a `fullscreenchange`
event is fired on the document.
-}
isActive : Signal Bool
isActive =
  Native.Fullscreen.fullscreenMode


{-| Requests that the document enter Fullscreen Mode.
-}
request : Task error ()
request =
  Native.Fullscreen.requestFullscreen


{-| Requests that the document exit Fullscreen Mode.
-}
exit : Task error ()
exit =
  Native.Fullscreen.exitFullscreen


{-|
Checks the document's current fullscreen status.
-}
status : Task error Status
status =
  Native.Fullscreen.checkStatus
