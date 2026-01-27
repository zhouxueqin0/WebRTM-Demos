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

// Subscribe to a channel (for message channels, not stream channels)
async function subscribeChannel(channelName: string) {
  try {
    await getGlobalRtmClient().subscribe(channelName);
  } catch (error) {
    console.error(`Failed to subscribe channel ${channelName}:`, error);
    throw error;
  }
}

// Unsubscribe from a channel
async function unsubscribeChannel(channelName: string) {
  try {
    await getGlobalRtmClient().unsubscribe(channelName);
  } catch (error) {
    console.error(`Failed to unsubscribe channel ${channelName}:`, error);
    throw error;
  }
}

// Send message to a channel
async function sendChannelMessage(channelName: string, message: string) {
  try {
    await getGlobalRtmClient().publish(channelName, message);
  } catch (error) {
    console.error(`Failed to send message to channel ${channelName}:`, error);
    throw error;
  }
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

export {
  initStreamChannel,
  joinTopic,
  subscribeChannel,
  unsubscribeChannel,
  sendChannelMessage,
  leaveStreamChannel,
};
