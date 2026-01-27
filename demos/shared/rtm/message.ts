// API-message

import {
  getGlobalRtmClient,
  GetHistoryMessageOptions,
  PublishOptions,
} from "./util";

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
    await getGlobalRtmClient().publish(channelName, message, {
      storeInHistory: true,
    });
  } catch (error) {
    console.error(`Failed to send message to channel ${channelName}:`, error);
    throw error;
  }
}

/**
 * Send message to a specific user (alias for publishPeerMessage)
 */
async function sendMessageToUser(userId: string, message: string) {
  try {
    await getGlobalRtmClient().publish(userId, message, {
      channelType: "USER",
      storeInHistory: true,
    });
  } catch (error) {
    console.error(`Failed to send message to user ${userId}:`, error);
    throw error;
  }
}

async function queryChannelMessages(
  channelName: string,
  options?: GetHistoryMessageOptions,
) {
  const messageList = await getGlobalRtmClient().history.getMessages(
    channelName,
    "MESSAGE",
    options,
  );
  return messageList;
}

export {
  sendMessageToUser,
  subscribeChannel,
  unsubscribeChannel,
  sendChannelMessage,
  queryChannelMessages,
};
