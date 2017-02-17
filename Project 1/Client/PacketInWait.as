package  {
	
	public class PacketInWait extends PacketIn {

		static public function tryReading(buffer:LegitBuffer):PacketInWait {
			if(buffer.length < 4) return null; // not enough data in the stream; packet incomplete
			return new PacketInWait(buffer);
		}

		public function PacketInWait(buffer:LegitBuffer) {
			_type = PacketType.WAIT;
			buffer.trim(4);
		}
	}
}
