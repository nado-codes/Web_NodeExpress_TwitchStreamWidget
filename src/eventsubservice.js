const axios = require("axios");

class EventSubService {
  constructor(clientId, broadcasterUserId) {
    this.clientId = clientId;
    this.broadcaster_user_id = broadcasterUserId;
  }

  Subscribe = (event, accessToken) =>
    axios.post(
      `https://api.twitch.tv/helix/eventsub/subscriptions`,
      {
        type: "channel.follow",
        version: "1",
        condition: { broadcaster_user_id: this.broadcaster_user_id },
        transport: {
          method: "webhook",
          callback: "https://localhost:443/webhooks/callback",
          secret: "purplemonkeydishwasher",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": appClientId,
          "Content-Type": "application/json",
        },
      }
    );
}

module.exports = {
  EventSubService,
};
