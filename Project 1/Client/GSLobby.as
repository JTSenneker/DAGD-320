package  {
	
	import flash.display.MovieClip;
	import flash.events.MouseEvent;

	public class GSLobby extends GameScene{

		public function GSLobby() {
			bttn1.addEventListener(MouseEvent.CLICK, handleClickPlay);
			bttn2.addEventListener(MouseEvent.CLICK, handleClickSpectate);
		}
		function handleClickPlay(e:MouseEvent):void{
			Game.socket.sendJoinRequest(true,txt1.text);
		}
		function handleClickSpectate(e:MouseEvent):void{
			Game.socket.sendJoinRequest(false,txt1.text);
		}
		public override function dispose():void{
			bttn1.removeEventListener(MouseEvent.CLICK, handleClickPlay);
			bttn2.removeEventListener(MouseEvent.CLICK, handleClickSpectate);
		}
		public override function handlePacket(packet:PacketIn):void{
			switch(packet.type){
				case PacketType.JOIN:
					GSPlay.playerid = PacketInJoin(packet).playerid;
					Game.showScene(new GSWait());
					break;
			}
		}
	}
}
