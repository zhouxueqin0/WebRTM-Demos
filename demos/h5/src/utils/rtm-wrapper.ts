/**
 * RTM wrapper for H5 project
 * Re-exports from shared/rtm to suppress Vite warnings about mixed exports
 */

// Re-export everything from shared/rtm
export {
  rtmLogin,
  initRtm,
  releaseRtm,
  sendChannelMessage,
  sendMessageToUser,
  subscribeChannel,
  unsubscribeChannel,
  initRtmEvents,
  releaseRtmEvents,
  initStreamChannel,
  joinTopic,
  getGlobalRtmClient,
  rtmEventEmitter,
  AgoraAppId,
  AgoraAppcert,
} from "../../../shared/rtm";

// Re-export types
export type {
  RTMClient,
  RTMConfig,
  RTMEvents,
  RTMStreamChannel,
  PublishOptions,
  RTMBaseError,
} from "../../../shared/rtm/util";
