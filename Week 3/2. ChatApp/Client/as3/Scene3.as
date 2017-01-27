package as3 {
	
	import flash.display.MovieClip;
	import flash.events.*;
	
	
	public class Scene3 extends Scene {
		
		
		public function Scene3() {
			input1.addEventListener(KeyboardEvent.KEY_DOWN, handleInput);
			bttn1.addEventListener(MouseEvent.CLICK, handleClick);
		}
		function handleInput(e:KeyboardEvent):void{
			if(e.keyCode == 13) sendName();
		}
		function handleClick(e:MouseEvent):void {
			sendName();
		}
		function sendName(): void{
			ChatApp.socket.writeUTFBytes("NAME\t"+input1.text+"\n");
			ChatApp.socket.flush();
		}
		public override function dispose():void{
			input1.removeEventListener(KeyboardEvent.KEY_DOWN, handleInput);
			bttn1.removeEventListener(MouseEvent.CLICK, handleClick);
		}
	}
	
}
