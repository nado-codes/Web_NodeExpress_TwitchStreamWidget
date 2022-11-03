const axios = require("axios");

class EventSubService {
  #clientId = "";
  #broadcaster_user_id = "";
  #callbackUrl = "";
  #secret = "";
  #events = {};

  constructor(clientId, broadcasterUserId, callbackUrl, secret) {
    this.#clientId = clientId;
    this.#broadcaster_user_id = broadcasterUserId;
    this.#callbackUrl = callbackUrl;
    this.#secret = secret;
    this.#events = {};
  }

  async Init(accessToken) {
    // .. populate this.events with the ids of all currently subscribed events
    const {
      data: { data: subData },
    } = await axios.get(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": this.#clientId,
      },
    });

    subData.map(({ id, type }) => (this.#events[type] = { id, type }));

    this.initialized = true;
  }

  IsSubscribed = (event) => this.#events[event] !== undefined;

  async Subscribe(event, accessToken) {
    if (!this.initialized)
      throw Error(`Please initialize the event service before subscribing`);

    if (this.#events[event] != undefined)
      throw Error(`Can't subscribe to the same event twice`);

    const {
      data: {
        data: [subData],
      },
    } = await axios.post(
      `https://api.twitch.tv/helix/eventsub/subscriptions`,
      {
        type: event,
        version: "1",
        condition: { broadcaster_user_id: this.#broadcaster_user_id },
        transport: {
          method: "webhook",
          callback: this.callbackUrl,
          secret: this.#secret,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": this.#clientId,
          "Content-Type": "application/json",
        },
      }
    );
    const { id, type } = subData;
    this.#events[event] = { id, type };

    return subData;
  }

  async Unsubscribe(event, accessToken) {
    if (!this.initialized)
      throw Error(`Please initialize the event service before unsubscribing`);

    if (this.#events[event] === undefined)
      throw Error(`No subscription exists for ${event}`);

    const { id } = this.#events[event];
    const res = await axios.delete(
      `https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": this.#clientId,
        },
      }
    );

    delete this.#events[event];

    return res;
  }
}

module.exports = {
  EventSubService,
};
