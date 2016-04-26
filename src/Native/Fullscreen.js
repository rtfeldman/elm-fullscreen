Elm.Native = Elm.Native || {};
Elm.Native.Fullscreen = {};
Elm.Native.Fullscreen.make = function(localRuntime){
  localRuntime.Native = localRuntime.Native || {};
  localRuntime.Native.Fullscreen = localRuntime.Native.Fullscreen || {};

  if (localRuntime.Native.Fullscreen.values){
    return localRuntime.Native.Fullscreen.values;
  }

  var fullscreenErrorEvent = "fullscreenerror";
  var NS = Elm.Native.Signal.make(localRuntime);
  var Task = Elm.Native.Task.make(localRuntime);
  var Utils = Elm.Native.Utils.make(localRuntime);
  var node = window;
  var doc = document;

  // Helper Functions //

  // Cross-browser function to get the current fullscreenElement, if any.
  function nativeGetFullscreenElement() {
    var element =
      document.fullscreenElement       ||
      document.mozFullScreenElement    ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    return element;
  }

  // Cross-browser function to reqeust fullscreen mode.
  var nativeRequestFullscreen;

  if (document.documentElement.requestFullscreen) {
    nativeRequestFullscreen = document.documentElement.requestFullscreen;
  } else if (document.documentElement.msRequestFullscreen) {
    nativeRequestFullscreen = document.documentElement.msRequestFullscreen;
  } else if (document.documentElement.mozRequestFullScreen) {
    nativeRequestFullscreen = document.documentElement.mozRequestFullScreen;
  } else if (document.documentElement.webkitRequestFullscreen) {
    nativeRequestFullscreen = function() {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    };
  }

  // Cross-browser function to exit fullscreen mode.
  var nativeExitFullscreen;

  if (document.exitFullscreen) {
    nativeExitFullscreen = document.exitFullscreen;
  } else if (document.msExitFullscreen) {
    nativeExitFullscreen = document.msExitFullscreen;
  } else if (document.mozCancelFullScreen) {
    nativeExitFullscreen = document.mozCancelFullScreen;
  } else if (document.webkitExitFullscreen) {
    nativeExitFullscreen = document.webkitExitFullscreen;
  }

  // Elm API Implementations //

  // fullscreenActive : Signal Bool
  var fullscreenActive = NS.input('Fullscreen.fullscreenActive', false);

  // The fullscreenActive signal should be True only when fullscreen mode is active.
  function registerFullscreenChangeListener(eventName) {
    localRuntime.addListener([fullscreenActive.id], doc, eventName, function fullscreenChange(event){
      localRuntime.notify(fullscreenActive.id, !!nativeGetFullscreenElement());
    });
  }

  // Each browser should fire exactly one of these events.
  registerFullscreenChangeListener("fullscreenchange");
  registerFullscreenChangeListener("mozfullscreenchange");
  registerFullscreenChangeListener("webkitfullscreenchange");

  // requestFullscreen : Task RequestError ()
  var requestFullscreen = function() {
    return Task.asyncFunction(function(callback){
      var failed = false;
      var errorListener = function() {
        failed = true;
      };

      try {
        document.addEventListener(fullscreenErrorEvent, errorListener);

        nativeRequestFullscreen();
      } catch (err) {
        failed = true;
      } finally {
        document.removeEventListener(fullscreenErrorEvent, errorListener);
      }

      if (failed) {
        return callback(Task.fail({ctor: "NotAllowed"}))
      } else {
        return callback(Task.succeed(Utils.Tuple0));
      }
    });
  };

  // exitFullscreen : Task error ()
  var exitFullscreen = function() {
    return Task.asyncFunction(function(callback){
      try {
        nativeExitFullscreen();

        return callback(Task.succeed(Utils.Tuple0));
      } catch (exception) {
        return callback(Task.fail());
      }
    });
  };

  var checkStatus = function() {
    // TODO
  };

  return {
    fullscreenActive  : fullscreenActive,
    requestFullscreen : requestFullscreen,
    exitFullscreen    : exitFullscreen,
    checkStatus       : checkStatus
  };

};
