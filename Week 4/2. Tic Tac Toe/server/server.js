const TTTProtocol = {
	buildJoinResponse:function(resp,err){
		const packet = Buffer.alloc(6);
		packet.write("JOIN");
		packet.writeUInt8(resp,4);
		packet.writeUInt8(err,5);
		return packet;
	},
};

const Game ={
	playerOnesTurn:true,
	cell1:0,
	cell2:0,
	cell3:0,
	cell4:0,
	cell5:0,
	cell6:0,
	cell7:0,
	cell8:0,
	cell9:0,
	checkForWin: function(){
		if(cell1 === cell2 && cell2 === cell3){
			if(cell1 === 1)return 1;
			else return 2;
		}
		if(cell4 === cell5 && cell5 === cell6){
			if(cell4 === 1)return 1;
			else return 2;
		}
		if(cell7 === cell8 && cell8 === cell9){
			if(cell7 === 1)return 1;
			else return 2;
		}

		if(cell1 !=0 && cell2 !=0 && cell3 !=0 &&cell4 !=0 && cell5 !=0 && cell6 !=0 &&cell7 !=0 && cell8 !=0 && cell9 !=0){
			return 3;
		}
		return 0;
	},
}

class Server {
	constructor(){
		this.port = 1234;
		this.clients = [];

		this.sock = require("net").createServer((sock) => {
			this.clients.push(new Client(this, sock));
		});
		this.sock.listen(this.port, () => {
			console.log("The server is running on port " + this.port);
		});
	}
	onDisconnect(client){
		this.clients.splice(this.clients.indexOf(client), 1);
	}
}

class Client {
	constructor(server, sock){
		
		this.server = server;
		this.sock = sock;
		this.buffer = Buffer.alloc(0);

		this.sock.on('error', (msg) => {});
		this.sock.on('close', () => {
			this.server.onDisconnect(this);
		});
		this.sock.on('data', (data) => this.onData(data));

		console.log("client connected");
	}
	onData(data){
		this.buffer = Buffer.concat([this.buffer,Buffer.from(data)]);
		//console.log(Buffer.from(this.buffer));
		if(this.buffer.length >=4){

			//while(true){
				const type = this.buffer.slice(0,4).toString();
				switch(type){
					case"JOIN":

						const usernameLength = this.buffer.readUInt8(5);
						const packetLength = 6+usernameLength;
						if(this.buffer.length >= packetLength){
							const packet = this.buffer.slice(0,packetLength);
							this.buffer = this.buffer.slice(packetLength,this.buffer.length);
							this.onPacketJoin(packet);
						}

						break;
					case"MOVE":
						break;
					default:
						console.log("unknown packet type")
						this.buffer = ligitBuffer.slice(1,this.buffer.length);
						break;
				}
			//}
		}
	}

	onPacketJoin(packet){
		const type = packet.readUInt8(4);
		const usernameLength = packet.readUInt8(5);
		const username = packet.slice(6,6+usernameLength).toString();
		console.log(username + " wants to "+(type == 1?"play":"spectate"));

		//determine whether or not the player can join

		this.sock.write(TTTProtocol.buildJoinResponse(1,0));
	}

	onMessage(msg){

	}
}

new Server();