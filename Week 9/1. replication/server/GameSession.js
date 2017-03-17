const Player = new require('./Player.js').Player;
const Tank = new require('./GameObjects.js').Tank;

exports.GameSession = class GameSession {

	constructor(server){
		this.server = server;
		this.players = [];
		this.tanks = [];
		this.deltaTime = 0;
		this.nextNetworkID = 0;
		this.timePrev = this.timeNow = Date.now();

		console.log("new game session beginning...");
		this.play();
	}
	addPlayer(rinfo){
		const player = new Player(rinfo, this);
		const tank = new Tank(this.getNextNetworkID(),player);
		
		this.players.push(player);
		this.tanks.push(tank);
	}
	play(){
		this.gameLoop();
	}
	stop(){
		if(this.timer) clearTimeout(this.timer);
		this.timer = null;
	}
	gameLoop(){
		this.timeNow = Date.now();
		this.deltaTime = (this.timeNow - this.timePrev)/1000;
		this.timePrev = this.timeNow;


		this.updateTanks();

		this.broadcast(this.getWorldStatePacket())

		this.tickPlayers();

		this.timer = setTimeout(() => this.gameLoop(), 17);
	}
	updateTanks(){
		this.tanks.map((tank)=>tank.update(this.deltaTime));
	}
	tickPlayers(){
		for(let i = this.players.length - 1; i >= 0; i--){
			if(this.players[i].isTimedOut()) {
				this.onDisconnect(this.players[i]);
			}
		}
		
		if(this.players.length == 0) this.server.onGameEmpty();
	}
	lookupPlayer(rinfo){
		let result = null;
		this.players.map((player) => {
			if(player.matches(rinfo)) result = player;
		});
		return result;
	}
	onDisconnect(player){
		this.players.splice(this.players.indexOf(player), 1);

		// TODO: remove disconnecting player's tank
		for(let i = this.tanks.length - 1; i >=0; i--){
			if(this.tanks[i].player == player) this.tanks.splice(i,1);
		}

		console.log("player " + player.username + " disconnected");

		// TODO: broadcast delta packet (DELETE this object)
	}
	broadcast(packet){
		this.players.map((player) => {
			this.server.sock.send(packet, 0, packet.length, player.rinfo.port, player.rinfo.address);
		});
	}
	handleInput(rinfo, buff){
		const player = this.lookupPlayer(rinfo);
		if(player){
			const bitfield = buff.readUInt8(4);
			player.handleInput(bitfield);
		}
	}
	getNextNetworkID(){
		return this.nextNetworkID++;
	}
	getWorldStatePacket(){
		const buffs = [new Buffer("REPL")];

		this.tanks.map((tank)=>{
			buffs.push(tank.getState());
		});

		return Buffer.concat(buffs);

	}
}