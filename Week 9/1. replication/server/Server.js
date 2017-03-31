const GameSession = new require('./GameSession.js').GameSession;

const JMGP = {
	NAME_SHORT:1,
	NAME_LONG:2,
	NAME_CHARS:3,
	NAME_TAKEN:4,
	GAME_FULL:5,
	buildJoinResponse:(err)=>{
		const packet = Buffer.alloc(5);
		packet.write("JNRP");
		packet.writeUInt8(err,4);
		return packet;
	},
	buildKick:()=>{
		const packet = Buffer.alloc(4);
		packet.write("KICK");
		return packet;
	}
}


exports.Server = class Server {
	constructor(){
		
		this.name = "Joe's baller server of people who be ballin'";

		this.sock = require('dgram').createSocket('udp4');
		this.sock.on('error', (e)=>{ this.onError(e); });
		this.sock.on('message', (packet, rinfo)=>{ this.onPacket(packet, rinfo); });
		this.sock.on('listening', ()=>{ this.onStart(); });

		this.game = null; // the current game session

		this.sock.bind(1234); // begin listening
	}
	onStart(){
		this.sock.setBroadcast(true);
		console.log("Server listening...");
		this.loop();
	}
	onError(e){

	}
	onPacket(packet, rinfo){
		//console.log("packet received ("+rinfo.address + ":" + rinfo.port+") : " + packet);

		if(packet.length < 4) return;
		const packetType = packet.slice(0, 4).toString();

		switch(packetType){
			case "JNRQ":
				const usernameLength = packet.readUInt8(4);
				const packetLength = usernameLength + 5;
				const username = packet.slice(5,5+usernameLength).toString();
				let errCode = this.approveName(username);
				if(errCode==0){
					this.sendJoinResponse(errCode,rinfo);
					this.addPlayer(rinfo,username);
				}
				break;
			case "INPT":
				if(this.game)this.game.handleInput(rinfo,packet);
				break;
		}
	}
	addPlayer(rinfo,username){
		if(this.game == null) this.game = new GameSession(this);
		this.game.addPlayer(rinfo,username);
	}
	onGameEmpty(){
		if(this.game != null){
			this.game.stop();
			this.game = null;
			console.log("game empty... closing...");
		}
	}

	broadcastPresence(){
		const packetLength = 4 + this.name.length;
		const buff = Buffer.alloc(packetLength);

		buff.write("BRPR");
		buff.write(this.name,4);

		this.sock.send(buff,0,buff.length,4321,"255.255.255.255");
	}

	loop(){
		this.broadcastPresence();
		setTimeout(()=>{ this.loop(); }, 1000);
	}

	/*
	function checks the passed in username and returns an error message
	depending on whether it is okay to use or not.
	*/
	approveName(name){
		if(this.game != null){
			for(let player of this.game.players){
				if(name == player.username)return JMGP.NAME_TAKEN;
			}
		}
		if(name.length < 4)return JMGP.NAME_SHORT;
		if(name.length > 16)return JMGP.NAME_LONG;
		if(!name.match(/^[a-zA-Z0-9\s\.\-\_]+$/))return JMGP.NAME_CHARS;
		return 0;
	}

	sendJoinResponse(errCode,rinfo){
		const buff = JMGP.buildJoinResponse(errCode);
		this.sock.send(buff,0,buff.length,rinfo.port,rinfo.address);
	}

	kickPlayer(rinfo){
		const buff = JMGP.buildKick();
		this.sock.send(buff,0,buff.length,rinfo.port,rinfo.address);
	}
}