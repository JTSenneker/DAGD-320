package  {
	
	public class PacketInJoin extends PacketIn {

		static public function tryReading(buffer:LegitBuffer):PacketInJoin {
			if(buffer.length < 6) return null; // not enough data in the stream; packet incomplete
			return new PacketInJoin(buffer);
		}
		
		public var playerid:int = 0;
		public var errcode:int = 0;
		
		public function PacketInJoin(buffer:LegitBuffer) {
			_type = PacketType.JOIN;
			playerid = buffer.readUInt8(4);
			errcode = buffer.readUInt8(5);
			buffer.trim(6);
		}
		public function errmsg():String {
			switch(errcode){
				case 0: return "";
				case 1: return "username too short";
				case 2: return "username too long";
				case 3: return "username uses invalid characters";
				case 4: return "username is already taken";
				case 5: return "The game session is full";
				default: return "unknown error";
			}
		}
		
	}
}
