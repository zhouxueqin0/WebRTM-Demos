import {
  AgoraAppId,
  rtmConfig,
  getGlobalRtmClient,
  RTM,
  setRtmClient,
  setRtmState,
} from "./util";
import { initRtmEvents, releaseRtmEvents } from "./rtm-events";

// login
async function rtmLogin(token?: string) {
  await getGlobalRtmClient()?.login({
    token,
  });
}

// init
async function initRtm(uid: string, token?: string) {
  let rtm;
  try {
    // reuse
    rtm = getGlobalRtmClient();
  } catch (_) {
    // create
    rtm = new RTM(AgoraAppId, uid, rtmConfig);
  }

  setRtmClient(rtm);

  // add event listeners
  initRtmEvents();

  // login
  await rtmLogin(token);
}

// renewToken
async function renewRtmToken(token: string) {
  await getGlobalRtmClient().renewToken(token);
}

// release
async function releaseRtm() {
  setRtmState("IDLE");
  releaseRtmEvents();
  await getGlobalRtmClient().logout();
}

export { initRtm, releaseRtm, rtmLogin, renewRtmToken };
