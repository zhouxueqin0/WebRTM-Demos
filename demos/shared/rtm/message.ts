// API-message

import { getGlobalRtmClient, PublishOptions } from "./util";

/**
 * peer to peer
 */
async function publishPeerMessage(
  targetUserId: string,
  msg: string | Uint8Array,
  options?: PublishOptions,
) {
  await getGlobalRtmClient().publish(targetUserId, msg, options);
}

/**
 * channel message
 */
async function publishChannelMessage(
  channelName: string,
  msg: string | Uint8Array,
  options?: PublishOptions,
) {
  await getGlobalRtmClient().publish(channelName, msg, options);
}

export { publishChannelMessage, publishPeerMessage };
