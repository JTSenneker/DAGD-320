class Server{
	constructor(){
		
		
		this.sock = require('dgram').createSocket('udp4');
		
		this.sock.on('listening',()=>{ this.onListening(); });
		this.sock.on('error',(err)=>{ this.onError(err); });
		this.sock.on('message',(msg,rinfo)=>{ this.onPacket(msg,rinfo); });
		
		this.sock.bind(1234);
		this.game = new Game(this);
	}
	onListening(){
		console.log("Server listening...");
	}
	onPacket(packet,rinfo){
		console.log("message received ("+rinfo.address+":"+rinfo.port+"): "+packet);

		if(packet.length<4)return;//not enough info. Invalid packet.
		switch(packet.slice(0,4).toString()){
			case"JREQ":
				if(GameState.players.length >=10){
					const buff = Protocol.packetJoin(false);
					this.sock.send(buff,0,buff.length,rinfo.port,rinfo.address);
				}else{
					const buff = Protocol.packetJoin(true);
					this.sock.send(buff,0,buff.length,rinfo.port,rinfo.address);
					GameState.players.push(new Player(rinfo));
					//accept request
				}
				console.log(GameState.players.length + " Players");
			break;
			case"INPT":
				if(packet.length !=9) break;
				GameState.players.map((player)=>{
					if(player.matches(rinfo)) player.onInput(packet);
				});
			break;
			case"DISC":
				let localPlayer = null;
				GameState.players.map((player)=>{
					if(player.matches(rinfo)) localPlayer = player;
				});
				if(localPlayer != null){
					GameState.players.splice(GameState.players.indexOf(localPlayer),1);
				}
				console.log(GameState.players.length + " Players");
			break;
		}
	}
	sendTo(player, buffer){
		this.sock.send(buffer,0,buffer.length,player.rinfo.port,player.rinfo.address);
	}
	broadcastState(){
		const buff = Protocol.packetState();
		GameState.players.map((player)=>{
			this.sendTo(player,buff);
		});
	}
	onError(e){}
}

let Protocol = {
	packetJoin:(canJoin)=>{
		const buffer = Buffer.alloc(5);
		buffer.write("JRSP");
		buffer.writeUInt8(canJoin?1:0,4);
		return buffer;

	},
	packetState:()=>{
		const buff = Buffer.alloc(4 + (GameState.players.length * 5));
		buff.write("GMST");
		let offset = 4;
		GameState.players.map((player)=>{
			buff.writeUInt16BE(player.x,offset);
			buff.writeUInt16BE(player.y,offset+2);
			buff.writeUInt8(player.flex ? 1 : 0, offset+4);
			offset+=5;
		});
		return buff;
	},
	packetKick:()=>{},
}

let GameState = {
	dt:0,
	pt:0,
	players:[],
};

class Player{
	constructor(rinfo){

		this.x = 0;
		this.y = 0;
		this.flex = false;

		this.rinfo = rinfo;
	}
	send(sock, buffer){
		sock.send(buffer,0,buffer.length,this.rinfo.port,this.rinfo.address);
	}
	matches(rinfo){
		if(rinfo.address != this.rinfo.address)return false;
		if(rinfo.port != this.rinfo.port)return false;
		if(rinfo.family != this.rinfo.family)return false;
		return true;
	}
	onInput(packet){
		this.x = packet.readUInt16BE(4);
		this.y = packet.readUInt16BE(6);
		this.flex = (packet.readUInt8(8) === 1);
		console.log("("+this.x+","+this.y+")"+(this.flex ? "FLEX":"weak"));
	}
}

class Game{
	constructor(server){
		this.server = server;
		this.update();
	}
	calcDeltaTime(){
		const t = Date.now();
		if(GameState.pt == 0)GameState.pt = t;
		GameState.dt = (t-GameState.pt)/1000;
		GameState.pt = t;
	}
	update(){
		this.calcDeltaTime();

		this.server.broadcastState();

		setTimeout(()=>{this.update();},100);
	}
}

new Server();