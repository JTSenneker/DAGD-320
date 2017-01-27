package as3 {
	import flash.net.Socket;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.DataEvent;
	
	public class Connection extends Socket{
		private var buffer:String = "";
		private const charTermination:String = "\n";
		public function Connection() {
			addEventListener(Event.CONNECT, handleConnect);
			addEventListener(IOErrorEvent.IO_ERROR, handleError);
			addEventListener(Event.CLOSE, handleClose);
			addEventListener(ProgressEvent.SOCKET_DATA, handleData);
		}
		
		private function handleConnect(e:Event):void {
			
		}
		private function handleError(e:IOErrorEvent):void {
			ChatApp.main.showScene1();
		}
		private function handleClose(e:Event):void {
			ChatApp.main.showScene1();
		}
		
		private function handleData(e:ProgressEvent):void {
			buffer += ChatApp.socket.readUTFBytes(ChatApp.socket.bytesAvailable);
			var messages:Array = buffer.split(charTermination);
			buffer = messages.pop();
			
			for(var i = 0; i < messages.length; i++){
				//textMain.text += messages[i] + "\n";
				trace(messages[i]);
				dispatchEvent(new DataEvent(DataEvent.DATA,false,false,messages[i]));
			}		
		}

	}
	
}
