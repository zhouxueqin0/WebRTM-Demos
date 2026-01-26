import { getGlobalRtmClient, getStreamChannel, setStreamChannel } from "./util";

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

export { initStreamChannel, joinTopic };
