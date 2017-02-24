let GameState = {
	dt:0,
	pt:0,
};

class Game{
	constructor(){
		this.update();
	}
	calcDeltaTime(){
		const t = Date.now();
		if(GameState.pt == 0)GameState.pt = t;
		GameState.dt = (t-GameState.pt)/1000;
		GameState.pt = t;
		console.log(GameState.dt);
	}
	update(){

		this.calcDeltaTime();
		setTimeout(()=>{this.update();},100);
	}
}
new Game();