package  {
	
	public class GSWait extends GameScene {

		override public function handlePacket(packet:PacketIn):void {
			trace("new packet: " + packet.type);
			switch(packet.type){
				case PacketType.UPDT:
					Game.showScene(new GSPlay(PacketInUpdt(packet).state));
					break;
			} // end switch
		} // end handlePacket()
	} // end class
} // end package
