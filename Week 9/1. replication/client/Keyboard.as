package {
	
	import flash.events.KeyboardEvent;
	import flash.display.Stage;
	
	public class Keyboard {

		
		public static const SPACE:int =		32;
		
		public static const LEFT:int =		37;
		public static const UP:int =		38;
		public static const RIGHT:int = 	39;
		public static const DOWN:int =		40;
		
		public static const P:int =			80;
		
		public static const W:int =			87;
		public static const A:int =			65;
		public static const S:int =			83;
		public static const D:int =			68;
		
		private static var keysCurr:Array = new Array();
		private static var keysPrev:Array = new Array();
		
		private static var tellTheServer = false;
		
		static public function setup(stage:Stage) {
			stage.addEventListener(KeyboardEvent.KEY_DOWN, handleKeyDown);
			stage.addEventListener(KeyboardEvent.KEY_UP, handleKeyUp);
		}
		static public function update():void {
			keysPrev = keysCurr.slice(); // store a COPY of the current keyboard state
			tellTheServer = false;
		}
		static public function isDown(keyCode:int):Boolean {
			return keysCurr[keyCode];
		}
		static public function isUp(keyCode:int):Boolean {
			return !isDown(keyCode);
		}
		static public function onDown(keyCode:int):Boolean {
			return keysCurr[keyCode] && !keysPrev[keyCode];
		}
		static public function onUp(keyCode:int):Boolean {
			return !keysCurr[keyCode] && keysPrev[keyCode];
		}
		
		static public function shouldWeTellTheServer():Boolean{
			return tellTheServer;
		}
		static private function changeKey(keyCode:uint, isDown:Boolean):void {
			if(keysCurr[keyCode] != isDown){
				switch(keyCode){
					case W:
					case A:
					case S:
					case D:
						tellTheServer = true;
						break;
				}	
			}
			keysCurr[keyCode] = isDown;
		}
		static private function handleKeyDown(e:KeyboardEvent):void {
			//trace(e.keyCode);
			changeKey(e.keyCode, true);
		}
		static private function handleKeyUp(e:KeyboardEvent):void {
			changeKey(e.keyCode, false);
		}
	}
}
