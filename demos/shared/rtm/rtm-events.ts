import {
  RTMEvents,
  setRtmState,
  getGlobalRtmClient,
  rtmEventEmitter,
} from "./util";

/**
 * @remarks
 * Best Practice!
 */
function handleLinkState(eventData: RTMEvents.LinkStateEvent) {
  rtmEventEmitter.emit("linkstate", eventData);

  /**
   * @example
   */
  const { currentState, reasonCode } = eventData;
  setRtmState(currentState);
  if (currentState === "FAILED") {
    switch (reasonCode) {
      case "SAME_UID_LOGIN": {
        // if retain this instance, you can call login again, and the other instance will not available.
        // if retain the other instance, just notify current user.
        break;
      }
      case "INVALID_TOKEN":
      case "TOKEN_EXPIRED": {
        // check token whether valid
        // re call login with new token
        break;
      }
      case "UNKNOWN": {
        // please contact agora technology supporter.
        break;
      }
      default: {
        // do nothing
        break;
      }
    }
  }

  if (currentState === "CONNECTING") {
    // you are logging or SDK reconnecting, do nothing
  }

  if (currentState === "DISCONNECTED" || currentState === "SUSPENDED") {
    // sdk is lost... you could wait SDK re-connecting or call login now.
  }

  if (currentState === "CONNECTED") {
    // now you could use rtm! please try call any api!
  }
}

function handleMessage(eventData: RTMEvents.MessageEvent) {
  rtmEventEmitter.emit("message", eventData);

  /**
   * @example
   */
  const { channelName, message, publisher, channelType, topicName } = eventData;
  console.log(`received message: ${message}`);
  if (channelType === "USER") {
    // this is peer message for you, only you can received!
    console.log(`message from user: ${publisher}`);
  } else if (channelType === "MESSAGE") {
    // this is channel message, all of the user subscribed this channel, would received!
    console.log(`message from user: ${publisher} in channel: ${channelName}`);
  } else if (channelType === "STREAM") {
    // message from the topic of the streamChannel, all of the user subscribed the publisher in this topic, would received!
    console.log(
      `message from user: ${publisher} in topic: ${topicName} of channel: ${channelName}`,
    );
  }
}

/**
 * global listening
 */
function initRtmEvents() {
  getGlobalRtmClient().addEventListener("linkState", handleLinkState);
  getGlobalRtmClient().addEventListener("message", handleMessage);
}

function releaseRtmEvents() {
  getGlobalRtmClient().removeEventListener("linkState", handleLinkState);
  getGlobalRtmClient().removeEventListener("message", handleMessage);
}

export { initRtmEvents, releaseRtmEvents };
