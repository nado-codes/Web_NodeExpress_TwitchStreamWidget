const express = require("express");
const app = express();
const port = 8080;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h3>Hello World!</h3>");
});

app.post("/webhooks/callback", async (req, res) => {
  const { type } = req.body?.subscription ?? {};
  const { event } = req.body;

  console.log("request: ", req.body);
  /* console.log(
    `Receiving ${type} request for ${event.broadcaster_user_name}: `,
    event
  );*/

  res.status(200).end();
});

/* app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); */
