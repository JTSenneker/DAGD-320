const interfaces = require('os').networkInterfaces();

for(const endpoint in interfaces){
	interfaces[endpoint].map((interface)=>{
		if(interface.internal == true){
			console.log(interface);
		}
	});
}
