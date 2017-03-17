package  {
	import flash.net.DatagramSocket;
	import flash.events.DatagramSocketDataEvent;
	import flash.utils.ByteArray;
	
	public class GameSocket {

		static private var localPort: int = 4321;
		
		static private var serverPort: int = 1234;
		static private var serverAddr: String = "127.0.0.1";
		
		static private var sock:DatagramSocket = new DatagramSocket();
		
		
		static public function setup() {
			sock.addEventListener(DatagramSocketDataEvent.DATA, handlePacket);
			sock.bind(localPort);
			sock.receive();
		}
		
		static public function send(ba:ByteArray):void {
			sock.send(ba, 0, ba.length, serverAddr, serverPort);
		}		
		
		static private function handlePacket(e:DatagramSocketDataEvent):void {
			var buff:LegitBuffer = LegitBuffer.make(e.data);
			if(buff.length <4)return;
			var packetType:String = buff.slice(0, 4).toString();
			
			switch(packetType){
				case "REPL":
					Game.handleReplication(buff);
					break;
			} // end switch
		} // end handlePacket
		
	}
}
