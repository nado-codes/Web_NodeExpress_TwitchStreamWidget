const axios = require("axios");

class EventSubService {
  constructor(clientId, broadcasterUserId) {
    this.clientId = clientId;
    this.broadcaster_user_id = broadcasterUserId;

    this.events = {};
  }

  async Init(accessToken) {
    // .. populate this.events with the ids of all currently subscribed events
    const {
      data: { data: subData },
    } = await axios.get(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": this.clientId,
      },
    });

    // .. add events to this.events and unsub from duplicates
    // subData.map((s) => )

    this.initialized = true;
  }

  async Subscribe(event, accessToken) {
    if (!this.initialized)
      throw Error(`Please initialize the event service before subscribing`);

    const {
      data: {
        data: [subData],
      },
    } = await axios.post(
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
          "Client-Id": this.clientId,
          "Content-Type": "application/json",
        },
      }
    );
    const { id } = subData;
    this.events[event] = id;

    return subData;
  }

  #unsubscribeById = (id, accessToken) =>
    axios.delete(
      `https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": this.clientId,
        },
      }
    );

  async Unsubscribe(event, accessToken) {
    if (!this.initialized)
      throw Error(`Please initialize the event service before unsubscribing`);

    if (this.events[event] === undefined)
      throw Error(`No subscription exists for ${event}`);

    const id = this.events[event];
    const res = await unsubscribeById(id, accessToken);

    return res;
  }
}

module.exports = {
  EventSubService,
};
