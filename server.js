/* eslint-disable no-console */
const http = require("http");
const debug = require("debug");
const app = require("./app");

const port = process.env.PORT || 4000;
app.set("port", port);

const server = http.createServer(app);

app.use((req, res) => {
  res.status(500).json({
    code: false,
    message: "Invalid Api.",
  });
});

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${port}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${port}`;
  debug(`Listening on ${bind}`);
};
server.on("error", onError);
server.on("listening", onListening);
server.listen(port, () => {
  console.log(`\n\nServer Started:\n>> http://localhost:${port}\n>> ${process.env.NODE_ENV.trim()} mode\n\n`);
});
