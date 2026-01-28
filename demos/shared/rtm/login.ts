import {
  AgoraAppId,
  rtmConfig,
  getGlobalRtmClient,
  RTM,
  setRtmClient,
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
  // reuse
  try {
    const rtm = getGlobalRtmClient();
    await rtmLogin(token);
    return;
  } catch (_) {}

  // create
  const rtm = new RTM(AgoraAppId, uid, rtmConfig);
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
  releaseRtmEvents();
  await getGlobalRtmClient().logout();
}

export { initRtm, releaseRtm, rtmLogin, renewRtmToken };
