// This sdk is under development and not used in the project yet.

import { useCallback, useEffect, useState } from "react";

const useChromecast = () => {
  const [session, setSession] = useState<chrome.cast.Session | null>(null);
  const initializeCastApi = useCallback(() => {
    const applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    const sessionRequest = new chrome.cast.SessionRequest(applicationID);
    const apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener
    );
    chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
  }, []);
  useEffect(() => {
    const loadCastInterval = setInterval(() => {
      if (chrome.cast.isAvailable) {
        console.log("Cast has loaded.");
        clearInterval(loadCastInterval);
        initializeCastApi();
      } else {
        console.log("Unavailable");
      }
    }, 1000);
  }, [initializeCastApi]);

  const sessionListener = (e: chrome.cast.Session) => {
    setSession(e);
    console.log("New session");
    if (e.media.length !== 0) {
      console.log("Found " + e.media.length + " sessions.");
    }
  };

  const receiverListener = (e: string) => {
    if (e === "available") {
      console.log("Chromecast was found on the network.");
    } else {
      console.log("There are no Chromecasts available.");
    }
  };

  const onInitSuccess = () => {
    console.log("Initialization succeeded");
  };

  const onInitError = () => {
    console.log("Initialization failed");
  };

  const launchApp = () => {
    console.log("Launching the Chromecast App...");
    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
  };

  const onRequestSessionSuccess = (e: chrome.cast.Session) => {
    console.log("Successfully created session: " + e.sessionId);
    setSession(e);
    // sendMessageToSender(e);
    session?.sendMessage(
      "urn:x-cast:com.google.cast.media",
      {
        type: "PLAY",
        url: window.location.href,
      },
      () => {
        console.log("Message sent successfully");
      },
      (e) => {
        console.log(e, " Error sending message");
      }
    );
  };

  const onLaunchError = () => {
    console.log("Error connecting to the Chromecast.");
  };

  const sendMessageToSender = (e: chrome.cast.Session) => {
    if (!session) {
      return;
    }
    const currentWebpageUrl = window.location.href;

    const message = {
      type: "PLAY",
      // mediaSessionId: session?.media[0].mediaSessionId,
      url: currentWebpageUrl,
    };
    session?.sendMessage(
      "urn:x-cast:com.google.cast.media",
      message,
      () => {
        console.log("Message sent successfully");
      },
      (error) => {
        console.log("Error sending message:", error);
      }
    );
  };

  const stopApp = () => {
    if (session) {
      session.stop(onStopAppSuccess, onStopAppError);
    } else {
      console.log("No session to stop.");
    }
  };

  const onStopAppSuccess = () => {
    console.log("Successfully stopped app.");
  };

  const onStopAppError = () => {
    console.log("Error stopping app.");
  };

  return {
    launchApp,
    stopApp,
  };
};

export default useChromecast;
