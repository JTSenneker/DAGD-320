const Player = new require('./Player.js').Player;
const Tank = new require('./GameObjects.js').Tank;
const Bullet = new require('./GameObjects.js').Bullet;
const Enemy = new require('./GameObjects.js').Enemy;
const Pickup = new require('./GameObjects.js').Pickup

exports.GameSession = class GameSession {

	constructor(server){
		this.server = server;
		this.players = [];
		this.tanks = [];
		this.bullets = [];
		this.enemies = [];
		this.pickups = [];
		this.deltaTime = 0;
		this.nextNetworkID = 0;
		this.timePrev = this.timeNow = Date.now();
		this.spawnTimer = 2;


		console.log("new game session beginning...");
		this.play();
	}

	//adds a player to the game and gives said player a Tank
	//also pushes player and tank to the players and tanks array respectively
	addPlayer(rinfo){
		const player = new Player(rinfo, this);
		
		
		this.players.push(player);
		
		const tank = new Tank(this.getNextNetworkID(),player);
		tank.x = this.players.indexOf(player) + 1 * 100;
		this.tanks.push(tank);
	}

	//Adds an enemy to the game
	//Also adds enemy to enemies array
	addEnemy(){
		const enemy = new Enemy(this.getNextNetworkID());
		this.enemies.push(enemy);
	}

	//Adds bullets to the bullets array
	addBullet(x,y,xSpeed,ySpeed,player){
		const bullet = new Bullet(this.getNextNetworkID(),x,y,xSpeed,ySpeed,player);
		this.bullets.push(bullet);
	}

	//Adds pickups to the pickups array
	addPickups(x,y){

		for(let i = (Math.random()*2)+5;i>=0;i--){
			const pickup = new Pickup(this.getNextNetworkID(),x,y);
			this.pickups.push(pickup);
		}
	}

	//Starts the game loop
	play(){
		this.gameLoop();
	}

	//Stops the game loop
	stop(){
		if(this.timer) clearTimeout(this.timer);
		this.timer = null;
	}

	//The game objects' update functions go here
	gameLoop(){
		this.timeNow = Date.now();
		this.deltaTime = (this.timeNow - this.timePrev)/1000;
		this.timePrev = this.timeNow;
		this.spawnTimer -= this.deltaTime;

		if(this.spawnTimer < 0){
			this.addEnemy();
			this.spawnTimer = 2;
		}

		this.updateTanks();
		this.updateBullets();
		this.updateEnemies();
		this.updatePickups();

		this.broadcast(this.getWorldStatePacket());

		this.tickPlayers();

		this.timer = setTimeout(() => this.gameLoop(), 10);
	}

	//updates the tank objects
	updateTanks(){
		this.tanks.map((tank)=>tank.update(this.deltaTime));
	}

	//UPDATE ENEMIES FUNCTION
	updateEnemies(){
		for(let i = this.enemies.length -1;i>=0;i--){
			this.enemies[i].update(this.deltaTime);
			//Collision Detection
			for(let j = this.bullets.length -1;j>=0;j--){
				if(this.enemies[i].checkCollide(this.bullets[j])){
					this.enemies[i].dead = true;
					this.bullets[j].dead = true;
					this.addPickups(this.enemies[i].x,this.enemies[i].y);
					console.log("ouch");
				}
			}
			//End collision detection

			
		}
	}//END ENEMY UPDATE FUNCTION

	//UPDATE BULLETS FUNCTION
	updateBullets(){
		for(let i = this.bullets.length - 1;i>=0;i--){
			this.bullets[i].update(this.deltaTime);
			for(let j = this.tanks.length-1;j>=0;j--){
				if(this.tanks[j].player == this.bullets[i].player) continue;
				if(this.bullets[i].checkCollide(this.tanks[j])){
					console.log("I hit player "+j);
				}	
			}
			
		}
	}//END UPDATE BULLETS
	
	//UPDATE PICKUPS FUNCTION
	updatePickups(){
		for(let i = this.pickups.length-1;i>=0;i--){
			this.pickups[i].update(this.deltaTime);
			for(let j = this.tanks.length-1;j>=0;j--){
				if(this.pickups[i].checkCollide(this.tanks[j])){
					this.pickups[i].dead = true;
				}
			}
		}
	}//END UPDATE PICKUPS

	tickPlayers(){
		for(let i = this.players.length - 1; i >= 0; i--){
			if(this.players[i].isTimedOut()) {
				this.onDisconnect(this.players[i]);
			}
		}
		
		if(this.players.length == 0) this.server.onGameEmpty();
	}
	lookupPlayer(rinfo){
		let result = null;
		this.players.map((player) => {
			if(player.matches(rinfo)) result = player;
		});
		return result;
	}
	onDisconnect(player){
		this.players.splice(this.players.indexOf(player), 1);

		// TODO: remove disconnecting player's tank
		for(let i = this.tanks.length - 1; i >=0; i--){
			if(this.tanks[i].player == player) this.tanks.splice(i,1);
		}

		console.log("player " + player.username + " disconnected");

		// TODO: broadcast delta packet (DELETE this object)
	}
	broadcast(packet){
		this.players.map((player) => {
			this.server.sock.send(packet, 0, packet.length, player.rinfo.port, player.rinfo.address);
		});
	}
	handleInput(rinfo, buff){
		const player = this.lookupPlayer(rinfo);
		if(player){
			const bitfield = buff.readUInt8(4);
			player.handleInput(bitfield);
		}
	}
	getNextNetworkID(){
		return this.nextNetworkID++;
	}
	getWorldStatePacket(){
		const buffs = [new Buffer("REPL")];

		this.tanks.map((tank)=>{
			buffs.push(tank.getState());
		});
		for(let i = this.bullets.length - 1;i>=0;i--){
			buffs.push(this.bullets[i].getState());
			if(this.bullets[i].dead===true){
				
				this.bullets.splice(i,1);
			}
		}
		for(let i = this.enemies.length - 1;i>=0;i--){
			buffs.push(this.enemies[i].getState());
			if(this.enemies[i].dead===true){
				this.enemies.splice(i,1);
			}
		}
		for(let i = this.pickups.length - 1;i>=0;i--){
			buffs.push(this.pickups[i].getState());
			if(this.pickups[i].dead===true){
				
				this.pickups.splice(i,1);
			}
		}

		return Buffer.concat(buffs);

	}
}