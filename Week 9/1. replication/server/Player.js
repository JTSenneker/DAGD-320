const KEY_W = 1<<0; //1
const KEY_A = 1<<1; //2
const KEY_S = 1<<2; //4
const KEY_D = 1<<3; //8
const TIMEOUT = 20000;

exports.Player = class Player {
	constructor(rinfo, game){
		this.rinfo = rinfo;
		this.game = game;
		this.username = "";

		this.inputW = false;
		this.inputA = false;
		this.inputS = false;
		this.inputD = false;

		console.log("New player just joined!");
	}
	matches(rinfo){
		if(rinfo.address != this.rinfo.address) return false;
		if(rinfo.port != this.rinfo.port) return false;
		return true;
	}
	handleInput(bitfield){
		this.inputW =(bitfield & KEY_W)>0;
		this.inputA =(bitfield & KEY_A)>0;
		this.inputS =(bitfield & KEY_S)>0;
		this.inputD =(bitfield & KEY_D)>0;
	}
	isTimedOut(){
		return (this.game.timeNow>this.connectionTimeout);
	}
	keepAlive(){
		this.connectionTimeout = Date.now()+TIMEOUT;
	}
}