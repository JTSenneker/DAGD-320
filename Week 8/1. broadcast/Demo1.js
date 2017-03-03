
class Server{
	constructor(){
		this.sock = require('dgram').createSocket('udp4');
		this.sock.on('message',(msg,rinfo)=>{this.onPacket(msg,rinfo);});
		this.sock.bind(1234,()=>{
			console.log("Server is listening...")
			this.loop();
		});
	}
	loop(){
		this.broadcastPresence();
		setTimeout(()=>{ this.loop(); }, 1000);
	}
	onPacket(packet,rinfo){
		console.log("packet from " + rinfo.address +":"+rinfo.port+" : "+ packet);
	}
	broadcastPresence(){
		const buff = new Buffer("Joe's mediocre server is over there.");
		this.sock.send(buff,0,buff.length,1234,"10.252.20.255");
	}
}

new Server();