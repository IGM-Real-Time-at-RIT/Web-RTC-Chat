//when receiving data, add it to the screen
const receive = (data) => {
  const chat = document.querySelector('#chat');
  const para = document.createElement('p');
  
  para.textContent = data;
  
  chat.appendChild(para);
};

//send message to all of our peers we've established 
//sending data streams to
//This takes our username and an array of peer connections
const send = (username, peers) => {
  const messageString = document.querySelector("#message").value;
  const message = `${username}: ${messageString}`;
  receive(message); /add to our screen
  
  //for each peer connection (sending connections, not receiving connections)
  for(let i = 0; i < peers.length; i++) {
    //call the connection's send function and pass a message
    peers[i].send(message); 
  }
};

//when we try to link to another user
//server conn is our connect to the main server
const link = (serverConn) => {
  const remoteUser = document.querySelector("#remoteUser").value;
  
  //connect establishes a connection to another user by id
  //We take our server connection and pass the user we want to connect to
  const peerObj = serverConn.connect(remoteUser);
  
  //when we receive data from that other user
  //The peerObj cannot send, only receive. 
  //For us to SEND, they need to connect to us with serverConn.on('connection')
  peerObj.on('data', receive);
  
  //when we successfully establish a receiving connection to the other user.
  //again, we cannot send this way, only receive. 
  peerObj.on('open', () => {
    receive(`Linked to ${remoteUser}`);
  });
};

//fired when the connect button is hit
const connectSocket = (e) => {
  const message = document.querySelector("#message");
  const linkButton = document.querySelector("#link");
  const sendButton = document.querySelector("#send");
  
  const username = document.querySelector("#username").value;
  
  //grab the domain and port from the URL, so we know where to connect to
  const host = window.location.hostname;
  const port = window.location.port;
  
  //list of all of our client connections
  const peers = [];

  //connect to our signal server.
  //Takes ip/host, port and a path (if embedded in another server)
  //Path is very useful because it gives a unique URL to connect to 
  //when embedding into your normal HTTP server
  const serverConn = new Peer(username, {host: host, port: port, path: '/peerjs'});
  
  //when we connect to the server successfully
  serverConn.on('open', (personalId) => {
    //personal id is the id the server assigns if you don't provide one.
    console.dir(personalId);
    receive(`Connected as ${username}`);
  });
  
  //when ANOTHER USER connects to us
  //peerConn is the peer connection from another user that connected to us
  serverConn.on('connection', (peerConn) => {
    peers.push(peerConn); //add to our connected user list
    receive(`${peerConn.peer} connected`);
  });
  
  //attach button events
  linkButton.addEventListener("click", () => link(serverConn));
  sendButton.addEventListener('click', () => send(username, peers));
};

const init = () => {
  const connect = document.querySelector("#connect");
  connect.addEventListener('click', connectSocket);
};

window.onload = init;