package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.utils.Dictionary;
	
	public class GS_Play extends GameScene {
		private var networkGameObjects:Dictionary = new Dictionary();
		
		public function GS_Play() {
			Game.state = 3;
			
			
		}
		
		/*private function gameLoop(e:Event):void {
			
			if(Keyboard.shouldWeTellTheServer()){
				//send packet to server...
				GameSocket.send(PacketFactory.Input());
			}
			Keyboard.update();
		}*/
		
		public override function dispose():void{
		}
		
		public function clearAnnounceBar():void{
			AnnouncementBar.text = "";
		}
		
		public function handleHudUpdate(health:int):void{
			HealthBar.w=100-(100-health);
		}
		
		public function handleAnnouncement(msg:String):void{
			AnnouncementBar.text = msg;
		}
		public function replicateObject(chunk:LegitBuffer):void{
			var action:int = chunk.readUInt8(1);
			var networkID:int = chunk.readUInt32(2);
			var classID:String = chunk.slice(6,10).toString();
			
			var obj:ReplicableGameObject = networkGameObjects[networkID];
			switch(action){
				case 0:
				case 1:
					if(!obj){
						obj = ObjectCreationRegistry.create(classID);
						if(obj){
							addChild(obj);
							networkGameObjects[networkID] = obj;
						}
					}
					if(obj){
						//Copy state into the object
						obj.replicate(chunk);
					}
					break;
				case 2:
					if(obj){
						//delete the object
						if(contains(obj))removeChild(obj);
					}
					break;
			}//end switch
		}
	}
	
}
