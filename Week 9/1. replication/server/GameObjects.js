class ReplicableGameObject {
	constructor(networkID, classID){
		this.networkID = networkID;
		this.classID = classID;
		this.dead = false;
	}
	getState(){
		const buff = Buffer.concat([Buffer.alloc(10), this.getPayload()]);

		buff.writeUInt8(buff.length);
		buff.writeUInt8(this.dead?2:1,1);
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

const ROTSPEED = 100;
const SPEED_MOVE = 300; //pixels per second
const BULLET_SPEED = 500;
const DEG2RAD = Math.PI / 180;

exports.Tank = class Tank extends ReplicableGameObject{
	constructor(networkID, player){
		super(networkID,"TANK");

		this.player = player;
		this.y = 460;
		this.rotation =0;

		this.xSpeed;
		this.ySpeed;

		//AABB
		this.top = 0;
		this.bottom = 0;
		this.left = 0;
		this.right =0;
		//AABB

		this.charge = 0;
		this.maxCharge = 100;
		this.speed =0;


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
			if(this.player.inputSpacePrev===false)this.player.game.addBullet(this.x,this.y,this.xSpeed,this.ySpeed);
			this.charge += 34 *dt;
			if(this.charge > this.maxCharge)this.charge = this.maxCharge;
			this.player.keepAlive();
		}
		if(this.player.inputSpace===false && this.player.inputSpacePrev===true){
			this.player.game.addBullet(this.x,this.y,this.xSpeed,this.ySpeed);
		}
		if(axisH!=0){
			this.rotation += axisH*dt*ROTSPEED;
			if(this.rotation>360)this.rotation -=360;
			if(this.rotation<360)this.rotation +=360;
			this.player.keepAlive();
		}

		if(axisV!=0){
			this.speed+=axisV*10;
			if(this.speed > SPEED_MOVE)this.speed = SPEED_MOVE;
			if(this.speed < -SPEED_MOVE)this.speed = -SPEED_MOVE;
			this.player.keepAlive();
		}else this.speed*=.95;

		this.ySpeed = Math.sin(this.rotation*DEG2RAD);
		this.xSpeed = Math.cos(this.rotation*DEG2RAD);
		this.x+=this.xSpeed* this.speed *dt;
		this.y+=this.ySpeed* this.speed *dt;
		this.player.inputSpacePrev = this.player.inputSpace;
	}

	getPayload(){
		const buff = Buffer.alloc(6);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);
		buff.writeInt16BE(this.rotation,4);

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
	constructor(networkID,x,y,xSpeed,ySpeed){
		super(networkID,"BLLT");
		this.x=x;
		this.y=y;

		this.xSpeed=xSpeed;
		this.ySpeed=ySpeed;
		//AABB
		this.top = 0;
		this.bottom = 0;
		this.left = 0;
		this.right =0;
		//AABB

	}
	update(dt){
		this.updateAABB();
		this.y += this.ySpeed*BULLET_SPEED*dt;
		this.x += this.xSpeed*BULLET_SPEED*dt;
		if(this.y < -50||this.y >550||this.x>850||this.x<-50)this.dead = true;
	}

	getPayload(){
		const buff = Buffer.alloc(4);
		buff.writeInt16BE(this.x,0);
		buff.writeInt16BE(this.y,2);
		
		
		return buff;
	}
	//updates values passed into the AABB collision check
	updateAABB(){
		this.top = this.y-2;
		this.bottom = this.y+2;
		this.left = this.x-2;
		this.right = this.x+2;
		console.log(this.top);
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

		this.speed = 100;
	}
	update(dt){
		this.updateAABB();
		this.y += this.speed*dt;
		if(this.y > 400)this.dead = true;
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

	checkCollide(other){
		if(this.top>other.bottom)return false;
		if(this.bottom <other.top)return false;
		if(this.left >other.right)return false;
		if(this.right < other.left)return false;
		return true;
	}
}