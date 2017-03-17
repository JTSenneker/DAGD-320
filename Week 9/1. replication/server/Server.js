const GameSession = new require('./GameSession.js').GameSession;

exports.Server = class Server {
	constructor(){
		this.sock = require('dgram').createSocket('udp4');
		this.sock.on('error', (e)=>{ this.onError(e); });
		this.sock.on('message', (packet, rinfo)=>{ this.onPacket(packet, rinfo); });
		this.sock.on('listening', ()=>{ this.onStart(); });

		this.game = null; // the current game session

		this.sock.bind(1234); // begin listening
	}
	onStart(){
		console.log("Server listening...");
	}
	onError(e){

	}
	onPacket(packet, rinfo){
		//console.log("packet received ("+rinfo.address + ":" + rinfo.port+") : " + packet);

		if(packet.length < 4) return;
		const packetType = packet.slice(0, 4).toString();

		switch(packetType){
			case "JNRQ":
				this.addPlayer(rinfo);
				break;
			case "INPT":
				if(this.game)this.game.handleInput(rinfo,packet);
				break;
		}
	}
	addPlayer(rinfo){
		if(this.game == null) this.game = new GameSession(this);
		this.game.addPlayer(rinfo);
	}
	onGameEmpty(){
		if(this.game != null){
			this.game.stop();
			this.game = null;
			console.log("game empty... closing...");
		}
	}
}