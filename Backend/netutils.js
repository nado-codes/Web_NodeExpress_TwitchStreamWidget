const verifyOrigin = (req, res) => {
  console.log("INCOMING REQ FROM ORIGIN: ", req.hostname);
  const allowedOrigins = [
    "localhost",
    "192.168.0.22",
    "192.168.0.110",
    "192.168.50.205",
    "192.168.50.52",
    "192.168.76.138",
  ];

  if (!allowedOrigins.includes(req.hostname)) {
    console.log("Request FAILED");
    throw Error(`ORIGIN-NOT-ALLOWED`);
  }
  console.log("Request PASSED");

  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
};

module.exports = {
  verifyOrigin,
};
