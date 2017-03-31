package  {
	
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import fl.events.ComponentEvent;
	import flash.events.Event;
	
	
	public class GS_Login extends GameScene {
		var mouseDown:Boolean = false;
		var server:GameServerEndpoint;
		
		public function GS_Login() {
			Game.state = 2;
			ServerList.addEventListener(Event.CHANGE, handleChangeSelection);
			ConnectBttn.addEventListener(ComponentEvent.BUTTON_DOWN, handleButton);
		}
		
		private function handleChangeSelection(e:Event):void{
			ConnectBttn.enabled = true;
		}
		private function handleButton(e:ComponentEvent):void{
			server = GameServerEndpoint(ServerList.selectedItem);
			
			GameSocket.send(PacketFactory.Join(UsernameField.text));
			
		}
		public override function dispose():void{
			ServerList.removeEventListener(Event.CHANGE, handleChangeSelection);
			ConnectBttn.removeEventListener(ComponentEvent.BUTTON_DOWN, handleButton);
		}
		public function updateServerList(gse:GameServerEndpoint):void{
			var alreadyInList:Boolean = false;
					
					for(var i:int = 0;i<ServerList.length;i++){
						var gseOld:GameServerEndpoint = GameServerEndpoint(ServerList.getItemAt(i));
						if(gseOld.matches(gse)){
							alreadyInList = true;
							gseOld.copyLabelFrom(gse);
						}
					}
					if(!alreadyInList){
						ServerList.addItem(gse);
						trace(gse.label);
					}
		}
	}
	
}
