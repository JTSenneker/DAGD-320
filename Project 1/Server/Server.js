const UCGP ={
	NAME_SHORT:1,
	NAME_LONG:2,
	NAME_CHARS:3,
	NAME_TAKEN:4,
	GAME_FULL:5,
	buildJoinResponse:(playerid,err)=>{
		const packet = Buffer.alloc(6);
		packet.write("JOIN");
		packet.writeUInt8(playerid,4);
		packet.writeUInt8(err,5);
		return packet;
	},
	buildUpdate:()=>{
		const packet = Buffer.alloc(10);
		packet.write("UPDT");
		packet.writeUInt8(Game.playersTurn,4);
		packet.writeUInt8(Game.winner,5);
		packet.writeUInt8(Game.player1HandCount,6);
		packet.writeUInt8(Game.player2HandCount,7);
		packet.writeUInt8(Game.topCardNumber,8);
		packet.writeUInt8(Game.topCardColor,9);
		return packet;
	},
	buildWait:()=>{
		return Buffer.from("WAIT");
	}
};

const Game = {
	winner:0,
	topCardNumber:1,
	topCardColor:3,
	player1HandCount:7,
	player2HandCount:7,
	playersTurn:1,
	reset:function(){
		this.winner=0;
		this.playersTurn =1;
		this.topCardNumber = 9;
		this.topCardColor = 1;
	},
	checkForWinner:function(){
		if(this.player1HandCount <= 0)this.winner = 1;
		else if(this.player2HandCount <= 0)this.winner = 2;
		else this.winner = 0;
	},
	/*
	updates the number of cards in a player's hand
	*/
	updatePlayerHand:function(n,client){
		if(client.playerid == 1){
			this.player1HandCount += n;
		}else this.player2HandCount +=n;
	},
	placeCard:function(cardNumber, cardColor,client){
		if(this.playersTurn != client.playerid)return false;
		if(this.winner !=0)return false;
		this.topCardNumber = cardNumber;
		this.topCardColor = cardColor;
		this.checkForWinner();
		this.playersTurn = ((this.playersTurn == 1)?2:1);
		
	}
};

class Server{
	constructor(){
		this.port = 1234;
		this.clients = [];
		this.player1 = null;
		this.player2 = null;

		this.sock = require("net").createServer((sock)=>{
			this.clients.push(new Client(this,sock));
		});
		this.sock.listen(this.port,()=>{
			console.log("The server is running on port " + this.port);
		});
	}

	/*
	This function will be called when a client disconnects from the server.
	It will remove the disconnected client from the clients array, and if
	the client is one of the two players, it will set that player to null,
	and reset the game.

	@PARAM: 'client' => The client that has disconnected from the server
	*/
	onDisconnect(client){
		this.clients.splice(this.clients.indexOf(client),1);
		if(this.player1 == client) this.player1 = null;
		if(this.player2 == client) this.player2 = null;
		if(this.player1 == null || this.player2 == null){
			Game.reset();
			this.broadcastStatus();
		}
	}

	/*
	This function will be called when a packet needs to be sent to
	the clients.
	*/
	broadcast(buffer){
		for(var client of this.clients){
			client.sock.write(buffer);
		}
	}
	/*
	This function will be used to update players on the state of the game.
	It will send an UPDT packet to the clients if the server is ready, or
	a WAIT packet if it is not.
	*/
	broadcastStatus(){
		if(this.isReady()){
			this.broadcast(UCGP.buildUpdate());
			console.log("ready");
			if(Game.winner != 0){
				Game.reset();
				this.player1 = null;
				this.player2 = null;
			}
		}else{
			this.broadcast(UCGP.buildWait());
		}
	}

	/*
	This function checks to see if there is a player 1 and a player 2
	and returns whether or not it's true
	*/
	isReady(){
		return(this.player1 != null && this.player2 != null);
	}
	/*
	This funciton checks to see if the requested name is okay for the server
	@PARAM: 'name' => The username being checked
	*/
	isNameOkay(name){
		if(name.length < 4) return UCGP.NAME_SHORT;
		if(name.length > 16) return UCGP.NAME_LONG;
		if(!name.match(/^[a-zA-Z0-9\s\.\-\_]+$/)) return UCGP.NAME_CHARS;
		for(var client of this.clients){
			if(name == client.username) return UCGP.NAME_TAKEN;
		}
		return 0;
	}

}

class Client{
	constructor(server,sock){
		this.playerid = 0;
		this.server = server;
		this.sock = sock;
		this.buffer= Buffer.alloc(0);
		this.username = "";

		this.sock.on('error',(msg)=>{});
		this.sock.on('close',()=>{
			this.server.onDisconnect(this);
		});
		this.sock.on('data',(data)=>this.onData(data));
		console.log("Client connected");
	}

	onData(data){
		this.buffer = Buffer.concat([this.buffer,Buffer.from(data)]);

		/*
		This will look for and process packet
		If it finds unexpected data, it starts removing data
		*/
		while(this.buffer.length >0){//if buffer is empty, break out of loop
			if(this.tryReadingPacket())break;//if the stream seems okay, break out of the loop
			this.destroyStreamData();//destroy the leading data in the stream and try again
		}
	}

	/*
	This function destroys leading data in the stream
	*/
	destroyStreamData(){
		this.buffer = this.buffer.slice(1,this.buffer.length);
	}

	/*
	This function is used to 
	*/
	tryReadingPacket(){
		switch(this.getNextPacketType()){
			case null:break;
			case "JOIN":
				this.readPacketJoin();
				break;
			case "MOVE":
				this.readPacketMove();
				break;
			case "CHAT":
				this.readPacketChat();
				break;
			default:
				return false;
				break;
		}
		return true;
	}

	/*
	This method is used to return the first 4 bytes of the packet as a string
	which should be JOIN, MOVE, or CHAT
	*/
	getNextPacketType(){
		if(this.buffer.length < 4)return null;
		return this.buffer.slice(0,4).toString();
	}

	/*
	splits the buffer at the index passed into the function.
	*/
	splitBufferAt(n){
		this.buffer=this.buffer.slice(n,this.buffer.length);
	}

	readPacketJoin(){
		//parse the packet
		if(this.buffer.length < 6) return;//packet is not complete. Not enough data to stream
		const joinRequestType = this.buffer.readUInt8(4);
		const usernameLength = this.buffer.readUInt8(5)
		const packetLength = 6 + usernameLength;
		if(this.buffer.length < packetLength)return;//not enought data to stream. Packet is not complete
		const username = this.buffer.slice(6,6+usernameLength).toString();
		this.splitBufferAt(packetLength);//remove this from the packet

		//determine if player can join
		let errorCode = this.server.isNameOkay(username);
		this.playerid = ((errorCode == 0) ? 3:0);//if there's no errors default to spectate

		if(joinRequestType == 1 && errorCode == 0){
			if(this.server.player1 == null){
				this.playerid = 1;
				this.server.player1 = this;
			}else if(this.server.player2 == null){
				this.playerid = 2;
				this.server.player2 = this;
			}else{
				this.playerid = 0;
				errorCode = UCGP.GAME_FULL;
			}
		}
		this.sock.write(UCGP.buildJoinResponse(this.playerid,errorCode));

		this.server.broadcastStatus();
	}

	readPacketMove(){
		if(this.buffer.length<7) return//not enough dtat in the stream; packet incomplete
		console.log("recieved move");
		const playType = this.buffer.readUInt8(4);
		const cardNumber = this.buffer.readUInt8(5);
		const cardColor = this.buffer.readUInt8(6);
		this.splitBufferAt(6);
		if(playType == 1){
			Game.updatePlayerHand(1,this);
			Game.topCardNumber = cardNumber;
			Game.topCardColor = cardColor;
		}
		else if(playType == 2){
			Game.placeCard(cardNumber,cardColor,this);
			Game.updatePlayerHand(-1,this);
			
		}
		this.server.broadcastStatus();
	}
	readPacketChat(){
		//TODO: Impliment
	}
	
}

new Server();