//255.255.255.255
//Universal Broadcast Address

const sock = require('dgram').createSocket('udp4');
sock.bind(1234,()=>{
	console.log("Server listening...");
	sock.setBroadcast(true);
	loop();
});
sock.on('message',(msg,rinfo)=>{
	console.log(rinfo.address + ":" + rinfo.port + " :"+ msg);
})
function loop(){
	const buff = new Buffer("Floop is a mad man, help us save us!");
	sock.send(buff,0,buff.length,1234,"255.255.255.255");
	setTimeout(()=>{loop();},1000)
}
