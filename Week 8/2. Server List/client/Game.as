package  {
	
	import flash.display.MovieClip;
	import flash.net.DatagramSocket;
	import flash.events.DatagramSocketDataEvent;
	import fl.events.ComponentEvent;
	import flash.utils.ByteArray;
	import flash.events.MouseEvent;
	import flash.events.Event;
	
	
	public class Game extends MovieClip {
		
		var sock:DatagramSocket = new DatagramSocket();
		var state:int = 1;
		var mouseDown:Boolean = false;
		
		var server:GameServerEndpoint;
		public function Game() {
			
			sock.addEventListener(DatagramSocketDataEvent.DATA,handlePacket);
			sock.bind(1234);
			sock.receive();
			
			list.addEventListener(Event.CHANGE, handleChangeSelection);
			bttn.addEventListener(ComponentEvent.BUTTON_DOWN, handleButton);
			

		}
		private function send(ba:ByteArray):void{
			sock.send(ba,0,ba.length,server.data.addr,server.data.port);
		}
		
		private function handleChangeSelection(e:Event):void{
			bttn.enabled = true;
		}
		private function handleButton(e:ComponentEvent):void{
			server = GameServerEndpoint(list.selectedItem);
			
			var buff:LegitBuffer = new LegitBuffer();
			buff.write("JREQ");

			send(buff.byteArray);
			
		}
		
		private function handlePacket(e:DatagramSocketDataEvent):void{
			var buff:LegitBuffer = LegitBuffer.make(e.data);
			var packetType = buff.slice(0,4).toString();
			switch(packetType){
				case "BRPR":
					if(state!=1)return;
					var serverName:String = buff.slice(4).toString();
					
					var gse:GameServerEndpoint = new GameServerEndpoint(serverName,e.srcAddress,e.srcPort);
				
					var alreadyInList:Boolean = false;
					
					for(var i:int = 0;i<list.length;i++){
						var gseOld:GameServerEndpoint = GameServerEndpoint(list.getItemAt(i));
						if(gseOld.matches(gse)){
							alreadyInList = true;
							gseOld.copyLabelFrom(gse);
						}
					}
					if(!alreadyInList){
						list.addItem(gse);
						trace(gse.label);
					}
					
					break;
				case "JRES":
					trace(e.srcAddress + ":" + e.srcPort + "says: " + buff.slice(5).toString());
					break;
			}
		}
	}
	
}
