const app = require("express")();
const { spawn } = require("child_process");
const port = 2022;

app.post("/trigger", (req, res) => {
  const { event, callback } = req.query;

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
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(
    `[cli-trigger]: Tried to send a "${event}" event to the twitch cli at ${callback}`
  );
});

app.listen(port, () =>
  console.log(`cli-trigger is now running on port ${port}`)
);
