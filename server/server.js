const http = require('http');
const path = require('path');
const express = require('express');
//import peerjs's Express server integration
const expressPeerServer = require('peer').ExpressPeerServer;

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../hosted/index.html`));
});

const server = http.createServer(app);

//create our peerjs server embedded in express under the /peerjs url
app.use('/peerjs', expressPeerServer(server));

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${PORT}`);
});

