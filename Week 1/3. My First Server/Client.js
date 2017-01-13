const net = require('net');

const connectOptions = {
	port: 1111,
	host: "10.252.20.211",
};

const sock = net.createConnection(connectOptions,function(){
	console.log("Connection successful!")
});

sock.on('error',function(errMsg){
	console.log("Something went wrong: "+ errMsg);
});