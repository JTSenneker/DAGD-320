const udp = require('dgram');
const sock = udp.createSocket('udp4');

const buff = new Buffer('Hello, world!');

sock.send(buff,0,buff.length,1234,"127.0.0.1",()=>{
	sock.close();
});
