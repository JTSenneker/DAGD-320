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


const SPEED_MOVE = 300; //pixels per second
const BULLET_SPEED = 500;
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
		if(this.player.inputSpace===true){
			this.player.game.addBullet(this.x,this.y);
			this.player.keepAlive();
		}
		if(axisH!=0){
			this.x+=axisH*SPEED_MOVE*dt;
			this.player.keepAlive();
		}
		if(axisV!=0){
			this.y -= axisV * SPEED_MOVE *dt;
			this.player.keepAlive();
		}
	}

	getPayload(){
		const buff = Buffer.alloc(4);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);

		return buff;
	}
}

exports.Bullet = class Bullet extends ReplicableGameObject{
	constructor(networkID,x,y){
		super(networkID,"BLLT");
		this.x=x;
		this.y=y;
		this.dead = false;
		console.log("pew");
	}
	update(dt){
		this.y -= BULLET_SPEED*dt;
	}

	getPayload(){
		const buff = Buffer.alloc(4);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);
		
		return buff;
	}
}
