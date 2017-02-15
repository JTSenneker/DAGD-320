package{

	public class PacketInUpdt extends PacketIn{
		static public function tryReading(buffer:LegitBuffer):PacketInUpdt{
			if(buffer.length < 10) return null;//not enough data in the stream; packet incomplete
			return new PacketInUpdt(buffer);
		}

		public var state:GameState;

		public function PacketInUpdt(buffer:Legitbuffer){
			_type = PacketType.UPDT;

			state = new GameState(buffer);
			buffer.trim(10);
		}
	}
}