package{
	public class GSWait extends GameScene{
		override public function handlePacket(packet:PacketIn):void{
			trace("new packet: "+ packet.type);
			switch(packet.type){
				case PacketType.UPDT:
				Game.showScene(new GSPlay(PacketInUptd(packet).state));
				break;
			}
		}
	}
}