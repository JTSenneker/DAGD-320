const net = require('net');

const listenOptions = {
	port: 1234,
	host: "127.0.0.1",
}

const handleIncomingConnection = function(socket){
	console.log("A client has connected!");
	socket.on('error', err => {console.log("err: "+err);});
};

const handleBeginListen = function(){
	console.log("Server running at "+ listenOptions.host + " : " + listenOptions.port);
};

const server = net.createServer(handleIncomingConnection);

server.listen(listenOptions, handleBeginListen);