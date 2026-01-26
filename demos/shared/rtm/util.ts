import AgoraRTM, {
  RTMClient,
  RTMConfig,
  RTMEvents,
  RTMStreamChannel,
  PublishOptions,
} from "agora-rtm";
const { RTM } = AgoraRTM;

// constant variables
const AgoraAppId = process.env.APP_ID || "";
const AgoraAppcert = process.env.APP_CERT || "";
const rtmConfig = {
  logLevel: "debug",
  logUpload: true,
  heartbeatInterval: 5,
  presenceTimeout: 10,
  cloudProxy: false,
  privateConfig: {
    serviceType: ["MESSAGE", "STREAM"],
    accessPointHosts: [],
    originDomains: [],
    eventUploadHosts: [],
    logUploadHosts: [],
  },
} as RTMConfig;

// business viriables
let globalRtmClient: RTMClient | null = null;
let rtmState: RTMEvents.LinkState = "IDLE";
const streamChannelMap: Map<string, RTMStreamChannel> = new Map();

function setRtmClient(client: RTMClient | null) {
  globalRtmClient = client;
}

function setRtmState(state: RTMEvents.LinkState) {
  rtmState = state;
}

function setStreamChannel(
  channelName: string,
  streamChannel: RTMStreamChannel,
) {
  streamChannelMap.set(channelName, streamChannel);
}

function delStreamChannel(channelName: string) {
  streamChannelMap.delete(channelName);
}

function getGlobalRtmClient() {
  if (!globalRtmClient) {
    throw new Error("rtm is not init.");
  }

  return globalRtmClient;
}

function isRtmAvailable() {
  if (!globalRtmClient) {
    return false;
  }

  // linkState
  if (rtmState !== "CONNECTED") {
    throw "rtm is not available.";
  }
}

function getStreamChannel(channelName: string) {
  if (!streamChannelMap.has(channelName)) {
    throw new Error("no stream channel");
  }

  return streamChannelMap.get(channelName)!;
}

export {
  // rtm
  RTM,
  RTMEvents,
  RTMClient,
  RTMStreamChannel,
  PublishOptions,
  // business
  AgoraAppId,
  AgoraAppcert,
  rtmConfig,
  rtmState,
  setRtmClient,
  setRtmState,
  setStreamChannel,
  delStreamChannel,
  getGlobalRtmClient,
  isRtmAvailable,
  getStreamChannel,
};
