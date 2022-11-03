// const https = require("https"); // https.createServer
const express = require("express");
const app = express();
const port = 2122; //443 for SSL
const _crypto = require("crypto");
const fs = require("fs");
const axios = require("axios");

const { EventSubService } = require("./eventsubservice");

const dataPath = "../src/data.json";
const twitchSigningSecret = "purplemonkeydishwasher";
const appClientId = "a9eaenvzkaras8oa9dxehmkyge5u0n";
const appSecret = fs.readFileSync("./secret.txt", "utf8");
const broadcasterUserId = "532759258";
const callbackUrl = "http://localhost:3001/webhooks/callback";
const eventSubService = new EventSubService(
  appClientId,
  broadcasterUserId,
  callbackUrl,
  twitchSigningSecret
);

app.get("/", (_, res) => {
  res.write("<h3>Welcome to Twitch Stream Widget!</h3>");
  res.write("<h4>Courtesy of NadoCo Interactive</h4>");
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

  // .. process the event by incrementing its respective count in the data.json
  const { type } = req.body.subscription;
  const { event } = req.body;

  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, {});

  const eventData = JSON.parse(fs.readFileSync(dataPath));

  eventData[type] = (eventData[type] ?? 0) + 1;
  fs.writeFileSync(dataPath, JSON.stringify(eventData));

  console.log(
    `Receiving ${type} request for ${event.broadcaster_user_name}: `,
    event
  );

  res.status(200).end();
});

const start = async () => {
  const listener =
    /* https
    .createServer(
      {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      },
      app
    ) */
    app.listen(port, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });

  // .. authenticate with twitch and get access token

  if (!fs.existsSync("./token.txt")) {
    console.log("Authenticating with Twitch...");
    const {
      data: { access_token },
    } = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${appClientId}&client_secret=${appSecret}&grant_type=client_credentials`,
      { test: "empty" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    fs.writeFileSync("./token.txt", access_token);
    console.log("...Done!");
  } else {
    console.log("Using access token from local file");
  }

  const access_token = fs.readFileSync("./token.txt", "utf-8");

  await eventSubService.Init(access_token);

  // .. subscribe to events
  console.log("Verifying event subscriptions...");
  if (!eventSubService.IsSubscribed("channel.follow")) {
    const { data: subData } = await eventSubService.Subscribe(
      "channel.follow",
      access_token
    );

    const { condition, transport } = subData;

    console.log("condition=", condition);
    console.log("transport=", transport);
  }

  console.log("Done!");
};

start();
