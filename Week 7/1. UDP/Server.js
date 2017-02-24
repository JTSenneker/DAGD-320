const udp = require('dgram');

const sock = udp.createSocket('udp4');

sock.on('listening',()=>{
	console.log("Server is listening...");
});
sock.on('error',(err)=>{});
sock.on('message',(msg,rinfo)=>{
	console.log("message received ("+rinfo.address+":"+rinfo.port+"): "+msg);
});

sock.bind(1234);