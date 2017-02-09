const UCGP ={
	NAME_SHORT:1,
	NAME_LONG:2,
	NAME_CHARS:3,
	NAME_TAKEN:4,
	GAME_FULL:5,
	buildJoinResponse:()=>{},
	buildUpdate:()=>{},
	buildWait:()=>{}
};

const Game = {

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
		for(var client of clients){
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
		for(var client of clients){
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
	
}