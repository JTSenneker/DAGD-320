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
			trace(packetType);
			switch(packetType){
				case "HUDT":
					var health = buff.readUInt8(4);
					Game.handleHudUpdate(health);
					break;
				case "ANCE":
					var msg:String = buff.slice(4).toString();
					Game.handleAnnouncement(msg);
					break;
				case "KICK":
					Game.switchScene(new GS_Login());
					break;
				case "JNRP":
					var errCode:int = buff.readUInt8(4);
					trace(errCode);
					if(errCode == 0){
						Game.switchScene(new GS_Play());
					}
					break;
				case "REPL":
					Game.handleReplication(buff);
					break;
				case "BRPR":
					if(Game.state != 2)return;
					var serverName:String = buff.slice(4).toString();
					
					var gse:GameServerEndpoint = new GameServerEndpoint(serverName,e.srcAddress,e.srcPort);
				
					Game.updateServerList(gse);
					
					break;
			} // end switch
		} // end handlePacket
		
	}
}
