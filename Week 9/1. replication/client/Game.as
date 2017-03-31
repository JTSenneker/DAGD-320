package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.utils.Dictionary;
	
	public class Game extends MovieClip {
		
		static private var main:Game;
		

		/*
			Game States
			1: GS_Title
			2: GS_Login
			3: GS_Play
		*/
		
		static public var state:int = 1;
		public var scene:GameScene;
		
		
		public function Game() {
			main = this;
			GameSocket.setup();
			Keyboard.setup(stage);//setup keyboard event listeners
			ObjectCreationRegistry.registerClasses();
			addEventListener(Event.ENTER_FRAME, gameLoop); // setup game loop
			state = 2;
			switchScene(new GS_Login());
			//GameSocket.send(PacketFactory.Join());
		}
		
		private function gameLoop(e:Event):void {
			if(Game.state != 3)return;
			if(Keyboard.shouldWeTellTheServer()){
				//send packet to server...
				GameSocket.send(PacketFactory.Input());
			}
			Keyboard.update();
		}
		
		static public function handleReplication(buff:LegitBuffer):void{
			if(Game.state != 3)return;
			var i:int = 4;
			while(i<buff.length){
				var chunkSize:int = buff.readUInt8(i);
				if(i+chunkSize > buff.length)break;//not enought data to read
				var chunk:LegitBuffer = buff.slice(i,i+chunkSize);
				
				GS_Play(main.scene).replicateObject(chunk);//hand off object for replication
				
				i+=chunkSize;
			}
		}
		
		static public function handleHudUpdate(health:int):void{
			if(Game.state !=3)return;
			GS_Play(main.scene).handleHudUpdate(health);
		}
		
		static public function handleAnnouncement(msg:String):void{
			if(Game.state !=3)return;
			GS_Play(main.scene).handleAnnouncement(msg);
		}
		
		
		static public function switchScene(scene:GameScene):void{
			main.clearScreen();
			main.addChild(scene);
			main.scene=scene;
		}
		
		private function clearScreen():void {
			if(scene){
				scene.dispose();
				removeChild(scene);
			}
		}
		static public function updateServerList(gse:GameServerEndpoint):void{
			GS_Login(main.scene).updateServerList(gse);
		}
		
	} // end class
} // end package
