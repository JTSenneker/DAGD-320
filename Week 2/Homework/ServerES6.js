const net = require('net');
class MyServer{

	constructor(){
		this.clients = [];
		this.options = {
			port:1234,
		};
	}

	charSplit(){
		return "\n";
	}

	start(){
		net.createServer((sock)=>{this.onConnect(sock);}).listen(this.onStartListen());
	}

	onStartListen(){
		console.log("Server running on port " + this.options.port);
	}

	onConnect(sock){
		client = new MyClient(this,sock);
		this.broadcast(client.username +" has joined!");
		clients.push(client);
	}

	onDisconnect(client){
		clients.splice(indexOf(client),1);
		this.broadcast(client.username + " disconnected!");
	}

	broadcast(msg){
		for(var client of clients){
			client.sendMsg(msg);
		}
	}
}

class MyClient{
	
	constructor(server,sock){
		this.server = server;
		this.sock = sock;
		this.username = sock.remoteAdress;
		this.buffer = "";
	}

	sendMsg(msg){
		sock.write(msg + charSplit);
	}

	onData(data){
		buffer += data;
		let messages = buffer.split(server.charSplit());
		buffer = messages.pop();
		for(var msg of messages){
			console.log("Message received: "+ msg);
			server.broadcast(username+": "+msg);
		}
	}

	onError(err){
		console.log("err: "+err);
	}

	onClose(){
		server.onDisconnect;
	}
}

server = new MyServer();
server.start();