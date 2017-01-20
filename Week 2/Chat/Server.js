const net = require('net');
const charSplit = "\n";
const listenOptions = {
	port: 1234,
};

let clients = [];

const broadcast = function(msg){
	clients.map((client)=>{
		client.sendMsg(msg);
	});
};

net.createServer((socket) => {
	console.log("A client has connected!");

	
	socket.sendMsg = (msg)=>{
		socket.write(msg + charSplit);
	};

	socket.username = socket.remoteAdress;
	socket.sendMsg("Welcome to my chat room!");
	broadcast(socket.username + " has joined!")
	clients.push(socket);

	let buffer = "";

	socket.on('error', (err) => {
		console.log("err: " + err);
	});
	socket.on('close',()=>{
		clients.splice(clients.indexOf(socket),1);
		broadcast(socket.username + " disconnected!");
	});
	
	socket.on('data',(data)=>{
		buffer += data;
		let messages = buffer.split(charSplit);
		buffer = messages.pop();

		messages.map((msg)=>{
			//handle msg
			console.log("Message received: "+ msg);
			broadcast(socket.username+ ": " +msg);
		});
		
	});

}).listen(listenOptions, ()=>{
	console.log("Server running on port " + listenOptions.port);
});