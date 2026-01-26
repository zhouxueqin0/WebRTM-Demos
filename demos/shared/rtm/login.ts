import {
  AgoraAppId,
  rtmConfig,
  getGlobalRtmClient,
  RTM,
  setRtmClient,
} from "./util";
import { addRtmEvents, removeRtmEvents } from "./rtm-events";

// login
async function rtmLogin(token?: string) {
  await getGlobalRtmClient()?.login({
    token,
  });
}

// init
async function initRtm(uid: string, token?: string) {
  // create
  const rtm = new RTM(AgoraAppId, uid, rtmConfig);
  setRtmClient(rtm);

  // add event listeners
  addRtmEvents();

  // login
  await rtmLogin(token);
}

// renewToken
async function renewRtmToken(token: string) {
  await getGlobalRtmClient().renewToken(token);
}

// release
async function releaseRtm() {
  removeRtmEvents();
  await getGlobalRtmClient().logout();
}

export { initRtm, releaseRtm, rtmLogin, renewRtmToken };
