package  {
	
	import flash.display.MovieClip;
	import flash.net.DatagramSocket;
	import flash.events.DatagramSocketDataEvent;
	import flash.utils.ByteArray;
	import flash.events.MouseEvent;
	
	
	public class Game extends MovieClip {
		
		var sock:DatagramSocket = new DatagramSocket();
		var mouseDown:Boolean = false;
		public function Game() {
			
			sock.addEventListener(DatagramSocketDataEvent.DATA,handlePacket);
			sock.receive();
			stage.addEventListener(MouseEvent.MOUSE_MOVE, handleMove);
			stage.addEventListener(MouseEvent.MOUSE_DOWN, handleMouseDown);
			stage.addEventListener(MouseEvent.MOUSE_UP, handleMouseUp);
			send(Protocol.packetJoin());

		}
		private function send(ba:ByteArray):void{
			sock.send(ba,0,ba.length,"127.0.0.1",1234);
		}
		private function handlePacket(e:DatagramSocketDataEvent):void{
			var buff:LegitBuffer = LegitBuffer.make(e.data);
			var packetType = buff.slice(0,4).toString();
			switch(packetType){
				case "GMST":
					graphics.clear();
					graphics.lineStyle(2,0);
					var offset:int = 4;
					while(offset + 5 <= buff.length){
						var cx:int = buff.readUInt16(offset);
						var cy:int = buff.readUInt16(offset+2);
						var flex:Boolean = buff.readUInt8(offset+4) == 1;
						
						graphics.drawCircle(cx,cy,flex?50:20);
						offset += 5;
					}
					break;
			}
		}
		private function handleMove(e:MouseEvent):void{
			send(Protocol.packetInput(mouseX,mouseY,mouseDown));
		}
		private function handleMouseDown(e:MouseEvent):void{
			mouseDown = true;
			send(Protocol.packetInput(mouseX,mouseY,mouseDown));
		}
		private function handleMouseUp(e:MouseEvent):void{
			mouseDown = false;
			send(Protocol.packetInput(mouseX,mouseY,mouseDown));
		}
	}
	
}
