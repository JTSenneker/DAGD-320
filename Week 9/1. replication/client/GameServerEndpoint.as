package  {
	
	public class GameServerEndpoint {
		
		public var label:String;
		public var icon = null;
		public var data:Object={
				addr:"",
				port:0
		};
		
		public function GameServerEndpoint(label:String,addr:String,port:uint) {
			this.label = label;
			this.data.addr = addr;
			this.data.port = port;
		}
		public function matches(other:GameServerEndpoint):Boolean{
			return (data.addr == other.data.addr && data.port == other.data.port);
		}
		public function copyLabelFrom(other:GameServerEndpoint):void{
			label = other.label;
		}

	}
	
}
