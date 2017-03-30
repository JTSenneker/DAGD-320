package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.utils.Dictionary;
	
	public class Game extends MovieClip {
		
		static private var main:Game;
		private var networkGameObjects:Dictionary = new Dictionary();
		
		
		public function Game() {
			main = this;
			GameSocket.setup();
			Keyboard.setup(stage);//setup keyboard event listeners
			ObjectCreationRegistry.registerClasses();
			addEventListener(Event.ENTER_FRAME, gameLoop); // setup game loop
			
			GameSocket.send(PacketFactory.Join());
		}
		
		private function gameLoop(e:Event):void {
			
			if(Keyboard.shouldWeTellTheServer()){
				//send packet to server...
				GameSocket.send(PacketFactory.Input());
			}
			Keyboard.update();
		}
		
		static public function handleReplication(buff:LegitBuffer):void{
			var i:int = 4;
			while(i<buff.length){
				var chunkSize:int = buff.readUInt8(i);
				if(i+chunkSize > buff.length)break;//not enought data to read
				var chunk:LegitBuffer = buff.slice(i,i+chunkSize);
				
				main.replicateObject(chunk);//hand off object for replication
				
				i+=chunkSize;
			}
		}
		
		private function replicateObject(chunk:LegitBuffer):void{
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
		
	} // end class
} // end package
