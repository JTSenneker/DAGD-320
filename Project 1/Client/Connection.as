package{
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.DataEvent;

	public class Connection extends Socket{
		var buffer:LegitBuffer = new LegitBuffer();

		public function Connection(){
			addEventListener(Event.CONNECT, handleConnect);
			addEventListener(IOErrorEvent.IO_ERROR, handleError);
			addEventListener(Event.CLOSE, handleClose);
			addEventListener(ProgressEvent.SOCKET_DATA, handleData);
		}

		/*
		EVENT CALLBACK FUNCTIONS
		*/
		private function handleConnect(e:Event):void{
			Game.showScene(new GSLobby());
		}
		private function handleError(e:IOErrorEvent):void{

		}
		private function handleClose(e:Event):void{
			Game.showScene(new GSLogin());
		}
		private function handleData(e:ProgressEvent):void{
			readBytes(buffer.byteArray,buffer.length);

			while(buffer.length >= 4){
				var keepLooping:Boolean = tryReadingPacket();
				if(!keepLooping)break;
			}
		}
		/*
		END EVENT CALLBACK FUNCTIONS
		*/

		private function tryReadingPacket():Boolean{
			if(buffer.length<4)return false//not enought info to read

			var packet:PacketIn = null;

			switch(getNextPacketType()){
				case PacketType.JOIN: packet = PacketInJoin.tryReading(buffer); break;
				case PacketType.UPDT: packet = PacketInUpdt.tryReading(buffer); break;
				case PacketType.WAIT: packet = PacketInWait.tryReading(buffer); break;
				default:
				/*
				Unknown Packet Type
				There is unrecognized data in the stream, so purge
				one character from the stream.
				*/
				buffer.trim();
				return true;//Continue Looping
			}

			/*
			If a packet was found and extracted from the buffer
			pass the packet along to the game class
			then keep looking for packets.
			*/
			if(packet != null){
				Game.handlePacket(packet);
				return true;
			}

			return false;
		}
		private function getNextPacketType():String{
			if(buffer.length<4)return "";
			return buffer.slice(0,4).toString();
		}
		
		//////////////// BUILDING PACKETS /////////////////
		
		//use ONLY this method for sending.
		//this will ensure that everything you send will use the LegitBuffer class
		public function write(buffer:LegitBuffer):void{
			writeBytes(buffer.byteArray);
			flush();
		}
		
		public function sendJoinRequest(playMode:Boolean, username:String):void{
			var buffer:LegitBuffer = new LegitBuffer();
			buffer.write("JOIN");
			buffer.writeUInt8(playMode ? 1:2,4);
			buffer.writeUInt8(username.length,5);
			buffer.write(username,6);
			
			write(buffer);
		}
		
		public function sendMove(cardNumber:int,cardColor:int,playType:int){
			var buffer:LegitBuffer = new LegitBuffer();
			buffer.write("MOVE");
			buffer.writeUInt8(playType,4);
			buffer.writeUInt8(cardNumber,5);
			buffer.writeUInt8(cardColor,6);
			trace("Move Sent");
			write(buffer);
		}
	}
}