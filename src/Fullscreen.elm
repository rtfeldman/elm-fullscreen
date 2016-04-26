module Fullscreen (Status(Active,RequestAvailable,RequestUnavailable,Unsupported), RequestError(NotAllowed), isActive, request, exit, status) where

{-| Elm bindings to HTML5 Fullscreen API.

# Status and Errors
@docs Status, RequestError

# Request or exit Fullscreen Mode
@docs request, exit

# Status
@docs isActive, status
-}

import Signal
import Task exposing (Task)

import Native.Fullscreen


{-|
  * Active - The page is currently in Fullscreen Mode.
  * RequestAvailable - The page is in a state where Fullscreen Mode can be requested.
  * RequestUnvailable - The page is not in a state where Fullscreen Mode can be requested.
  * Unsupported - This browser does not support the Fullscreen API.
-}
type Status
  = Active
  | RequestAvailable
  | RequestUnavailable
  | Unsupported


{-|
  * NotAllowed - The page is not currently allowed to enter Fullscreen Mode.
-}
type RequestError
  = NotAllowed


{-|
A signal of Booleans representing whether Fullscreen Mode is active. It begins
False and switches to True or False as appropriate whenever a `fullscreenchange`
event is fired on the document.
-}
isActive : Signal Bool
isActive =
  Native.Fullscreen.fullscreenMode


{-| Requests that the document enter Fullscreen Mode.

Since the HTML5 spec calls for the `fullscreenerror` event to be fired only in
the course of requesting fullscreen mode, such errors are handled by
`Fullscreen.request`' using normal `Task` error handling instead of something
like a Signal for the `fullscreenerror` event.

See the spec for more info: https://fullscreen.spec.whatwg.org/#api
-}
request : Task RequestError ()
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
