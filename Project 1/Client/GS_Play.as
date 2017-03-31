package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	
	
	public class GS_Play extends GameScene {
		
		
		public function GS_Play() {
			Game.state = 3;
			addEventListener(Event.ENTER_FRAME, gameLoop); // setup game loop
		}
		
		private function gameLoop(e:Event):void {
			
			if(Keyboard.shouldWeTellTheServer()){
				//send packet to server...
				GameSocket.send(PacketFactory.Input());
			}
			Keyboard.update();
		}
	}
	
}
