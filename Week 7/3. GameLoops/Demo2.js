class Game{
	constructor(){
		this.update();
	}
	update(){
		console.log("test!");
		setTimeout(()=>{this.update();},100);
	}
}
new Game();