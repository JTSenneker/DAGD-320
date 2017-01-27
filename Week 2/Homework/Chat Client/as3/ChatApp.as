package as3 {	import flash.display.MovieClip;	import flash.net.Socket;	import flash.events.*;		public class ChatApp extends MovieClip {				public static var socket:Socket = new Socket();		
		private var scene:Scene;
				public function ChatApp() {						socket.addEventListener(Event.CONNECT, handleConnect);			socket.addEventListener(IOErrorEvent.IO_ERROR, handleError);			socket.addEventListener(Event.CLOSE, handleClose);						showScene1();		}				function handleConnect(e:Event):void {			showScene2();		}		function handleError(e:IOErrorEvent):void {			showScene1();		}		function handleClose(e:Event):void {			showScene1();		}		private function clearScreen(){
			if(scene == null) return;			scene.dispose();
			removeChild(scene);		}		public function showScene1(){
			clearScreen();
			scene = new Scene1();			addChild(scene);		}		public function showScene2(){			clearScreen();
			scene = new Scene2();			addChild(scene);		}	}}