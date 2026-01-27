import {
  getGlobalRtmClient,
  getStreamChannel,
  setStreamChannel,
  delStreamChannel,
} from "./util";

// API-streamchannel
async function initStreamChannel(channelName: string, token?: string) {
  const streamChannel = getGlobalRtmClient().createStreamChannel(channelName);
  setStreamChannel(channelName, streamChannel);
  await streamChannel.join({
    token,
  });
}

// API-TOPIC
async function joinTopic(channelName: string, topicName: string) {
  await getStreamChannel(channelName).joinTopic(topicName);
}

// Leave stream channel
async function leaveStreamChannel(channelName: string) {
  try {
    const streamChannel = getStreamChannel(channelName);
    await streamChannel.leave();
    delStreamChannel(channelName);
  } catch (error) {
    console.error(`Failed to leave stream channel ${channelName}:`, error);
    throw error;
  }
}

export { initStreamChannel, joinTopic, leaveStreamChannel };
