const ChatProtocol = {
	charTermination: "\n",
	charSplit: "\t",
	buildPacket: function(parts){
		return parts.join(this.charSplit) + this.charTermination;
	},
	buildNameOkay: function(){
		return this.buildPacket(["NAMEOK"]);
	},
	buildNameBad: function(msg){
		return this.buildPacket(["NAMEBAD",msg]);
	},
	buildAnnounce: function(msg){
		return this.buildPacket(["ANNOUNCE",msg]);
	},
	buildChat: function(name,msg){
		return this.buildPacket(["CHAT", name, msg]);
	},
};

class Server{
	constructor(){
		const net = require("net");
		this.port = 1234;
		this.clients = [];
		this.sock = net.createServer((sock)=>{this.handleConnection(sock)});
		this.sock.listen(this.port,()=>{
			console.log("Server listening on port: "+ this.port);
		});

	}
	handleConnection(sock){
		this.clients.push(new Client(this, sock));
	}

	handleDisconnect(client){
		console.log("A client disconnected!");
		this.clients.splice(this.clients.indexOf(client),1);
	}
	/**
	* @param msg:String 	The message to send. This should already be a packet built by the ChatProtocol 
	**/
	broadcast(msg){
		this.clients.map((client)=>{
			client.sock.write(msg);
		});
	}

	isNameOkay(name){
		if(name.length < 4) return "Name too short";
		if(name.length > 16) return "Name too long";

		if(!name.match(/^[a-zA-Z\s\.\-_]+$/))return "Name has invalid characters";

		let isNameTaken = false
		this.clients.map((client)=>{
			if(client.username == name) isNameTaken = true;
		});

		if(isNameTaken)return "Name is already taken";
		return "";

	}
}

class Client{
	constructor(server,sock){
		this.sock = sock;
		this.server = server;
		console.log("A client connected from " + sock.remoteAddress);
		this.sock.on("error",(msg) => {  });
		this.sock.on("close",() => { this.server.handleDisconnect(this); });
		this.sock.on("data",(data) => { this.handleData(data); });
		this.sock.write(ChatProtocol.buildAnnounce("Welcome to your doom!"));
		this.username = "";
		this.buffer = "";
		sock.write(ChatProtocol.buildNameBad());
	}
	handleData(data){
		this.buffer += data;
		const messages = this.buffer.split("\n");
		this.buffer = messages.pop();
		messages.map((item)=>{ this.handleMessage(item); });
	}
	handleMessage(msg){
		const parts = msg.split("\t");
		
		switch(parts[0]){
			case "CHAT":

				if(this.username == ""){
					this.sock.write(ChatProtocol.buildNameBad("No Name!"));
				}else{
					const text = parts[1];
					console.log("Chat: "+text);
					this.server.broadcast(ChatProtocol.buildChat(this.username, text));
				}
					break;
				case "NAME":
					const newName = parts[1];
					const nameResult = this.server.isNameOkay(newName);
					if(nameResult == ""){
						this.sock.write(ChatProtocol.buildNameOkay());
						if(this.username ==""){
							this.sock.write(ChatProtocol.buildAnnounce(newName + " joined the room!"));
						}else{
							this.sock.write(ChatProtocol.buildAnnounce(this.username + " changed their name to " + newName))
						}
					}else{
						//BAD
						this.sock.write(ChatProtocol.buildNameBad(nameResult));
					}
					break;
				case "PM":
				break;
			default:
				console.log("Received an unknown packet from "+this.sock.remoteAddress);
			
		}
	}

}

new Server();