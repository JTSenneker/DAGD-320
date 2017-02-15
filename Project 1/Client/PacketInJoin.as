package{
	public class PacketInJoin extends PacketIn{
		static public function tryReading(buffer:LegitBuffer):PacketInJoin{
			if(buffer.length < 6)return null;//not enough data in the stream. Incomplete packet.
			return new PacketInJoin(buffer);
		}

		public var playerid:int = 0;
		public var errcode:int = 0;

		public function PacketInJoin(buffer:LegitBuffer){
			_type = PacketType.JOIN;
			playerid = buffer.readUInt8(4);
			errcode = buffer.readUInt8(5);
			buffer.trim(6);
		}
		public function errmsg():String{
			switch(errcode){
				case 1: return "username is too short";
				case 2: return "username is too long";
				case 3: return "username contains invalid characters";
				case 4: return "username is already taken";
				case 5: return "the game is full";
				case 0: return "";
				default: return "unknown error"
			}
		}
	}
}