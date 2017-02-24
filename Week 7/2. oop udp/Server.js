class Server{
	constructor(){
		
		
		this.sock = require('dgram').createSocket('udp4');
		
		this.sock.on('listening',()=>{ this.onListening(); });
		this.sock.on('error',(err)=>{ this.onError(e); });
		this.sock.on('message',(msg,rinfo)=>{ this.onPacket(msg,rinfo); });
		
		this.sock.bind(1234);
	}
	onListening(){
		console.log("Server listening...");
	}
	onPacket(packet,rinfo){
		console.log("message received ("+rinfo.address+":"+rinfo.port+"): "+packet);	
	}
	onError(e){}
}

new Server();