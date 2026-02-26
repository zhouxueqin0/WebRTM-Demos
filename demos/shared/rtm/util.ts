import EventEmitter from "events";
import "./private-parameter.ts";

import AgoraRTM, {
  RTMClient,
  RTMConfig,
  RTMEvents,
  RTMStreamChannel,
  PublishOptions,
} from "agora-rtm";
const { RTM, constantsType } = AgoraRTM;

// 环境变量获取函数
// - Vite/Nuxt: import.meta.env.VITE_*
// - Webpack: process.env.APP_*
// - Next.js: process.env.NEXT_PUBLIC_*
function getAgoraAppId(): string {
  // @ts-ignore - import.meta.env 在 Vite 环境下可用
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_APP_ID) {
    // @ts-ignore
    return import.meta.env.VITE_APP_ID;
  }
  return (
    process.env.APP_ID ||
    process.env.NEXT_PUBLIC_APP_ID ||
    ""
  );
}

function getAgoraAppCert(): string {
  // @ts-ignore - import.meta.env 在 Vite 环境下可用
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_APP_CERT) {
    // @ts-ignore
    return import.meta.env.VITE_APP_CERT;
  }
  return (
    process.env.APP_CERT ||
    process.env.NEXT_PUBLIC_APP_CERT ||
    ""
  );
}

// 导出为函数引用，调用时获取值
const AgoraAppId = getAgoraAppId;
const AgoraAppCert = getAgoraAppCert;
const rtmConfig = {
  logLevel: "debug",
  logUpload: true,
  heartbeatInterval: 5,
  presenceTimeout: 10,
  cloudProxy: false,
  // example
  // privateConfig: {
  //   serviceType: ["MESSAGE", "STREAM"],
  //   accessPointHosts: ["your-ap-domain:port"],
  //   originDomains: ["your-edge-domain:port"],
  //   eventUploadHosts: [],
  //   logUploadHosts: [],
  // },
} as RTMConfig;

type RTMEventMap = {
  [K in keyof RTMEvents.RTMClientEventMap]: Parameters<
    RTMEvents.RTMClientEventMap[K]
  >;
};

// business viriables
let globalRtmClient: RTMClient | null = null;
let rtmState: RTMEvents.LinkState = "IDLE";
const streamChannelMap: Map<string, RTMStreamChannel> = new Map();
const rtmEventEmitter = new EventEmitter<RTMEventMap>();

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

// rtm
export * from "agora-rtm";
export {
  RTM,
  constantsType,
  // business
  AgoraAppId,
  AgoraAppCert,
  rtmConfig,
  rtmState,
  rtmEventEmitter,
  setRtmClient,
  setRtmState,
  setStreamChannel,
  delStreamChannel,
  getGlobalRtmClient,
  isRtmAvailable,
  getStreamChannel,
};
