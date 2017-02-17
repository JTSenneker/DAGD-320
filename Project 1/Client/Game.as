package  {
	
	import flash.events.MouseEvent;
	import flash.display.MovieClip;
	
	
	public class Game extends MovieClip {
		
		public static var socket:Connection = new Connection();
		private static var main:Game;
			
		private var scene:GameScene;
		
		public function Game() {
			main = this;
			showScene(new GSLogin());
			
		}
		private function clearScreen():void {
			if(scene){
				scene.dispose();
				removeChild(scene);
			}
		}
		public static function showScene(scene:GameScene):void {
			main.clearScreen();
			main.addChild(scene);
			main.scene = scene
		}
		public static function handlePacket(packet:PacketIn):void {
			if(main && main.scene){
				main.scene.handlePacket(packet);
			}
		}
	}
}
