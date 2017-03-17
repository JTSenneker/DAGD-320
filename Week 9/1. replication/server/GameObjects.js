class ReplicableGameObject {
	constructor(networkID, classID){
		this.networkID = networkID;
		this.classID = classID;
	}
	getState(){
		const buff = Buffer.concat([Buffer.alloc(10), this.getPayload()]);

		buff.writeUInt8(buff.length);
		buff.writeUInt32BE(this.networkID, 2);
		buff.write(this.classID, 6);
		//console.log(buff);
		return buff;
	}
	getPayload(){
		// override this method in child classes
		return new Buffer("");
	}
	update(){
		// override this method in child classes
	}
}


const SPEED_MOVE = 100; //pixels per second
const SPEED_TURN = 90;	//degrees per second
const DEG2RAD = Math.PI / 180;

exports.Tank = class Tank extends ReplicableGameObject{
	constructor(networkID, player){
		super(networkID,"TANK");

		this.player = player;

		this.x = Math.random()*150+200;
		this.y = Math.random()*200+200;
		this.angle = 0;
	}

	update(dt){
		let axisH = 0;
		if(this.player.inputD===true) axisH++;
		if(this.player.inputA===true) axisH--;

		let axisV = 0;
		if(this.player.inputW===true) axisV++;
		if(this.player.inputS===true) axisV--;

		if(axisH!=0){
			this.angle+=axisH*SPEED_TURN*dt;
			if(this.angle > 360)this.angle -= 360;
			if(this.angle < 0)this.angle += 360;
		}
		if(axisV!=0){
			const rads = this.angle * DEG2RAD;
			this.x += axisV * SPEED_MOVE * Math.cos(rads) *dt;
			this.y += axisV * SPEED_MOVE * Math.sin(rads) *dt;

		}
	}

	getPayload(){
		const buff = Buffer.alloc(6);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);
		buff.writeInt16BE(this.angle*10,4);

		return buff;
	}
}
