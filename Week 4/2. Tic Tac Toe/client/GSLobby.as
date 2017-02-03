package  {
	
	import flash.display.MovieClip;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	
	public class GSLobby extends GameScene {
		
		
		public function GSLobby() {
			//txt1.addEventListener(KeyboardEvent.KEY_DOWN, handleKey);
			bttn1.addEventListener(MouseEvent.CLICK, handleClickPlay);
			bttn2.addEventListener(MouseEvent.CLICK, handleClickSpectate);
		}
		function handleClickPlay(e:MouseEvent):void {
			Game.socket.sendJoinRequest(true,txt1.text);
		}
		function handleClickSpectate (e:MouseEvent):void{
			Game.socket.sendJoinRequest(false,txt1.text);
		}
		public override function dispose():void {
			//txt1.removeEventListener(KeyboardEvent.KEY_DOWN, handleKey);
			bttn2.removeEventListener(KeyboardEvent.KEY_DOWN, handleClickSpectate);
			bttn1.removeEventListener(MouseEvent.CLICK, handleClickPlay);
		}
	}
	
}
