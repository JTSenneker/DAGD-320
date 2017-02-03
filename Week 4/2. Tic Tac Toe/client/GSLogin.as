package  {
	
	import flash.display.MovieClip;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	
	public class GSLogin extends GameScene {
		
		public function GSLogin() {
			txt1.addEventListener(KeyboardEvent.KEY_DOWN, handleKey);
			txt2.addEventListener(KeyboardEvent.KEY_DOWN, handleKey);
			bttn.addEventListener(MouseEvent.CLICK, handleClick);
		}
		function handleKey(e:KeyboardEvent):void {
			if(e.keyCode == 13) connect();
		}
		function handleClick(e:MouseEvent):void {
			connect();
		}
		function connect():void {
			Game.socket.connect(txt1.text, int(txt2.text));
		}		
		public override function dispose():void {
			txt1.removeEventListener(KeyboardEvent.KEY_DOWN, handleKey);
			txt2.removeEventListener(KeyboardEvent.KEY_DOWN, handleKey);
			bttn.removeEventListener(MouseEvent.CLICK, handleClick);
		}
	}
	
}
