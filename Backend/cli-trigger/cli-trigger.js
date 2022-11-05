const app = require("express")();
const { spawn } = require("child_process");
const { verifyOrigin } = require("../netutils");
const port = 2022;

app.post("/trigger", (req, res) => {
  const { event, callback } = req.query;

  verifyOrigin(req, res);

  // .. if this app is ever hosted, the incoming "event" and "callback" will need to be sanitized to prevent malicious use
  const tw = spawn("twitch", [
    "event",
    "trigger",
    event,
    `-F${callback}`,
    "-spurplemonkeydishwasher",
  ]);

  tw.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  tw.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  tw.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  tw.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.status(200).end();
  });
});

app.listen(port, () =>
  console.log(`cli-trigger is now running on port ${port}`)
);
