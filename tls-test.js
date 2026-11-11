const tls = require("tls");

const hosts = [
  "ac-lmxl9gb-shard-00-00.pvvyeor.mongodb.net",
  "ac-lmxl9gb-shard-00-01.pvvyeor.mongodb.net",
  "ac-lmxl9gb-shard-00-02.pvvyeor.mongodb.net"
];

for (const host of hosts) {
  const socket = tls.connect({
    host,
    port: 27017,
    servername: host,
    rejectUnauthorized: true,
    timeout: 10000
  });

  socket.on("secureConnect", () => {
    console.log("TLS SUCCESS:", host);
    socket.end();
  });

  socket.on("error", (err) => {
    console.log("TLS FAILED:", host, err.code || err.message);
  });

  socket.on("timeout", () => {
    console.log("TLS TIMEOUT:", host);
    socket.destroy();
  });
}
