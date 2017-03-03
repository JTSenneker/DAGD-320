
class Server{
	constructor(){

		this.name = "Joe's baller server of people who be ballin'"

		this.sock = require('dgram').createSocket('udp4');
		this.sock.on('message',(msg,rinfo)=>{this.onPacket(msg,rinfo);});
		this.sock.bind(4321,()=>{
			this.sock.setBroadcast(true);
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
		if(packet.length < 4) return;//not enough data, invalid packet.
		const packetType = packet.slice(0,4).toString();
		switch(packetType){
			case"JREQ":
				const welcome = "Keep pimpin";
				const buff = Buffer.alloc(5 + welcome.length);

				buff.write("JRES");
				buff.writeUInt8(1,4);
				buff.write(welcome,5);
				this.sock.send(buff,0,buff.length,rinfo.port,rinfo.address);
				break;
		}
	}
	broadcastPresence(){
		const packetLength = 4 + this.name.length;
		const buff = Buffer.alloc(packetLength);
		
		buff.write("BRPR");
		buff.write(this.name,4);

		this.sock.send(buff,0,buff.length,1234,"255.255.255.255");
	}
}

new Server();