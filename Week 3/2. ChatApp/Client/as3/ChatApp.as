package as3 {	import flash.display.MovieClip;	import flash.net.Socket;	import flash.events.*;		public class ChatApp extends MovieClip {				public static var socket:Connection = new Connection();		public static var main: ChatApp;
		
		private var scene:Scene;
				public function ChatApp() {
			main = this;
			socket.addEventListener(DataEvent.DATA,handleMessage);			showScene1();		}		private function handleMessage(e:DataEvent):void{
			var msg: String = e.data;
			var parts:Array = msg.split("\t");
			
			switch(parts[0]){
				case"NAMEBAD":
					showScene3();
					break;
				case "NAMEOK":
					showScene2();
					break;
				default:
					if(scene != null){
						scene.handleMessage(e.data);
					}
					break;
			}
		}		private function clearScreen(){
			if(scene == null) return;			scene.dispose();
			removeChild(scene);		}		public function showScene1(){
			clearScreen();
			scene = new Scene1();			addChild(scene);		}		public function showScene2(){			clearScreen();
			scene = new Scene2();			addChild(scene);		}
		public function showScene3(){
			clearScreen();
			scene = new Scene3();
			addChild(scene);
		}	}}