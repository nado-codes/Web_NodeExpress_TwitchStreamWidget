const express = require("express");
const https = require("https");
const app = express();
const port = 443;
const _crypto = require("crypto");
const fs = require("fs");
const axios = require("axios");

const { EventSubService } = require("./eventsubservice");

const twitchSigningSecret = "purplemonkeydishwasher";
const appClientId = "a9eaenvzkaras8oa9dxehmkyge5u0n";
const appSecret = fs.readFileSync("./secret.txt", "utf8");
const broadcasterUserId = "532759258";
const eventSubService = new EventSubService(appClientId, broadcasterUserId);

app.get("/", (_, res) => {
  res.send("<h3>Hello World!</h3>");
});

const verifyTwitchSignature = (req, res, buf, encoding) => {
  const messageId = req.header("Twitch-Eventsub-Message-Id");
  const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
  const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
  const time = Math.floor(new Date().getTime() / 1000);
  console.log(`Message ${messageId} Signature: `, messageSignature);

  if (Math.abs(time - timestamp) > 600) {
    // needs to be < 10 minutes
    console.log(
      `Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`
    );
    throw new Error("Ignore this request.");
  }

  if (!twitchSigningSecret) {
    console.log(`Twitch signing secret is empty.`);
    throw new Error("Twitch signing secret is empty.");
  }

  const computedSignature =
    "sha256=" +
    _crypto
      .createHmac("sha256", twitchSigningSecret)
      .update(messageId + timestamp + buf)
      .digest("hex");
  console.log(`Message ${messageId} Computed Signature: `, computedSignature);

  if (messageSignature !== computedSignature) {
    throw new Error("Invalid signature.");
  } else {
    console.log("Verification successful");
  }
};

app.use(express.json({ verify: verifyTwitchSignature }));

app.post("/webhooks/callback", async (req, res) => {
  // .. verify the event
  const messageType = req.header("Twitch-Eventsub-Message-Type");
  if (messageType === "webhook_callback_verification") {
    console.log("Verifying Webhook");
    return res.status(200).send(req.body.challenge);
  }

  // .. process the event
  const { type } = req.body.subscription;
  const { event } = req.body;

  console.log(
    `Receiving ${type} request for ${event.broadcaster_user_name}: `,
    event
  );

  res.status(200).end();
});

const start = async () => {
  const listener = https
    .createServer(
      {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      },
      app
    )
    .listen(port, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });

  // .. authenticate with twitch and get access token
  const { data } = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${appClientId}&client_secret=${appSecret}&grant_type=client_credentials`,
    { test: "empty" },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token } = data;

  // .. subscribe to follow events
  // return;

  // .. CREATE AN "EVENTSUB" SERVICE CLASS TO HANDLE THIS STUFF
  // .. also consider deleting subscriptions too as twitch wont let you subscribe twice
  const {
    data: { data: followData },
  } = await eventSubService.Subscribe("channel.follow", access_token);

  const { condition, transport } = followData;

  console.log("condition=", condition);
  console.log("transport=", transport);
};

start();
