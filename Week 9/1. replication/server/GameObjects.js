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
		this.y = 460;

		//AABB
		this.top = 0;
		this.bottom = 0;
		this.left = 0;
		this.right =0;
		//AABB

		this.charge = 0;
		this.maxCharge = 100;
	}

	update(dt){
		this.updateAABB();
		let axisH = 0;
		if(this.player.inputD===true) axisH++;
		if(this.player.inputA===true) axisH--;

		let axisV = 0;
		if(this.player.inputW===true) axisV++;
		if(this.player.inputS===true) axisV--;
		if(this.player.inputSpace===true){
			if(this.player.inputSpacePrev===false)this.player.game.addBullet(this.x,this.y);
			this.charge += 34 *dt;
			if(this.charge > this.maxCharge)this.charge = this.maxCharge;
			this.player.keepAlive();
		}
		if(this.player.inputSpace===false && this.player.inputSpacePrev===true){
			this.player.game.addBullet(this.x,this.y);
		}
		if(axisH!=0){
			this.x+=axisH*SPEED_MOVE*dt;
			this.player.keepAlive();
		}
		if(axisV!=0){
			this.y -= axisV * SPEED_MOVE *dt;
			this.player.keepAlive();
		}
		this.player.inputSpacePrev = this.player.inputSpace;
	}

	getPayload(){
		const buff = Buffer.alloc(4);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);

		return buff;
	}

	//updates values passed into the AABB collision check
	updateAABB(){
		this.top = this.y-10;
		this.bottom = this.y+10;
		this.left = this.x-7.5;
		this.right = this.x+7.5;
	}
}

exports.Bullet = class Bullet extends ReplicableGameObject{
	constructor(networkID,x,y){
		super(networkID,"BLLT");
		this.x=x;
		this.y=y;

		//AABB
		this.top = 0;
		this.bottom = 0;
		this.left = 0;
		this.right =0;
		//AABB

		this.dead = false;
	}
	update(dt){
		this.updateAABB();
		this.y -= BULLET_SPEED*dt;
		if(this.y < -50)this.dead = true;
	}

	getPayload(){
		const buff = Buffer.alloc(5);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);
		buff.writeUInt8(this.dead?1:0,4);
		
		return buff;
	}
	//updates values passed into the AABB collision check
	updateAABB(){
		this.top = this.y-10;
		this.bottom = this.y+10;
		this.left = this.x-7.5;
		this.right = this.x+7.5;
	}
}

exports.Enemy = class Enemy extends ReplicableGameObject{
	constructor(networkID){
		super(networkID,"ENMY");
		this.x=Math.random()*800;
		this.y=-100;
		
		//AABB
		this.top = 0;
		this.bottom = 0;
		this.left = 0;
		this.right =0;
		//AABB

		this.dead = false;
		this.speed = 100;
	}
	update(dt){
		this.updateAABB();
		this.y += this.speed*dt;
		if(this.y > 400)this.dead = true;
	}
	getPayload(){
		const buff = Buffer.alloc(5);

		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);
		buff.writeUInt8(this.dead?1:0,4);
		
		return buff;
	}
	//updates values passed into the AABB collision check
	updateAABB(){
		this.top = this.y-10;
		this.bottom = this.y+10;
		this.left = this.x-7.5;
		this.right = this.x+7.5;
	}

	checkCollide(other){
		if(this.top>other.bottom)return false;
		if(this.bottom <other.top)return false;
		if(this.left > other.right)return false;
		if(this.right < other.left)return false;
		return true;
	}
}