'use strict';

var receive = function receive(data) {
  var chat = document.querySelector('#chat');
  var para = document.createElement('p');

  para.textContent = data;

  chat.appendChild(para);
};

var send = function send(username, peers) {
  var messageString = document.querySelector("#message").value;
  var message = username + ': ' + messageString;
  receive(message);

  for (var i = 0; i < peers.length; i++) {
    peers[i].send(message);
  }
};

var link = function link(serverConn) {
  var remoteUser = document.querySelector("#remoteUser").value;
  var peerObj = serverConn.connect(remoteUser);
  peerObj.on('data', receive);
  peerObj.on('open', function () {
    receive('Linked to ' + remoteUser);
  });
};

//fired when the connect button is hit
var connectSocket = function connectSocket(e) {
  var message = document.querySelector("#message");
  var linkButton = document.querySelector("#link");
  var sendButton = document.querySelector("#send");

  var username = document.querySelector("#username").value;

  //grab the domain and port from the URL, so we know where to connect to
  var host = window.location.hostname;
  var port = window.location.port;

  //list of all of our client connections
  var peers = [];

  var serverConn = new Peer(username, { host: host, port: port, path: '/peerjs' });

  serverConn.on('open', function (personalId) {
    //personal id is the id the server assigns if you don't provide one.
    console.dir(personalId);
    receive('Connected as ' + username);
  });

  serverConn.on('connection', function (peerConn) {
    peers.push(peerConn);
    receive(peerConn.peer + ' connected');
  });

  linkButton.addEventListener("click", function () {
    return link(serverConn);
  });
  sendButton.addEventListener('click', function () {
    return send(username, peers);
  });
};

var init = function init() {
  var connect = document.querySelector("#connect");
  connect.addEventListener('click', connectSocket);
};

window.onload = init;
