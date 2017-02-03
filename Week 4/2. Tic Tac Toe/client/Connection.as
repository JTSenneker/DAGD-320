package {
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.DataEvent;
	
	public class Connection extends Socket {

		var charSplit:String = "\t";
		var charTerminate:String = "\n";
		var buffer:ByteArray = new ByteArray();
		
		public function Connection() {
			addEventListener(Event.CONNECT, handleConnect);
			addEventListener(IOErrorEvent.IO_ERROR, handleError);
			addEventListener(Event.CLOSE, handleClose);
			addEventListener(ProgressEvent.SOCKET_DATA, handleData);
		}
		private function handleConnect(e:Event):void {
			Game.showScene(new GSLobby());
		}
		private function handleError(e:IOErrorEvent):void {
			
		}
		private function handleClose(e:Event):void {
			Game.showScene(new GSLogin());
		}
		private function handleData(e:ProgressEvent):void {
			readBytes(buffer,buffer.length);
			if(buffer.length >=4){
				var str:String = buffer.readUTFBytes(4);
				switch(str){
					case "JOIN":
						if(buffer.length >=6){
							var packet:ByteArray = new ByteArray();
							buffer.position = 0;
							buffer.readBytes(packet);
							handleJoinResponse(packet);
							
							var tem: ByteArray = new ByteArray();
							buffer.position = 6;
							buffer.readBytes(temp);
							buffer = temp;
							
						}
						break;
					case "STRT":
						break;
					case "UPDT":
						break;
					case "OVER":
						break;
					default:
						trace("unknown packet type");
						trace(buffer);
						break;
					
				}
			}
		} // end handleData()
		
		
		//////////////////////////////
		//packet handling
		/////////////////////////////
		private function handleJoinResponse(packet:ByteArray):void{
			packet.readMultiByte(4, "us-ascii");
			var resp:int = packet.readByte();
			var err:int = packet.readByte();
			
			trace("received a join response... you are player # "+resp+" ... error code: " + err);
		}
		
		//////////////////////////////
		//Packet building
		//////////////////////////////
		
		/*
		*@param 'playMode' type boolean. True = play while False = spectate
		*@param 'username' type String. The player's username.
		*/
		public function sendJoinRequest(playMode:Boolean,username:String):void{
			var output:ByteArray = new ByteArray();
			output.writeMultiByte("JOIN","us-ascii");
			output.writeByte(playMode ? 1 : 2);
			output.writeByte(username.length);
			output.writeMultiByte(username,"us-ascii");
			writeBytes(output);
			flush();
		}
	}
}
