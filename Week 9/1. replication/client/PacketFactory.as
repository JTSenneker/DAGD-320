package  {
	import flash.utils.ByteArray;
	
	public class PacketFactory {

		static public function Join():ByteArray{
			var buff:LegitBuffer = new LegitBuffer();
			buff.write("JNRQ");
			return buff.byteArray;
		}
		
		static public function Input():ByteArray{
			var bitfield:int = 0;
			
			if(Keyboard.isDown(Keyboard.W)) bitfield |= (1 << 0);
			if(Keyboard.isDown(Keyboard.A)) bitfield |= (1 << 1);
			if(Keyboard.isDown(Keyboard.S)) bitfield |= (1 << 2);
			if(Keyboard.isDown(Keyboard.D)) bitfield |= (1 << 3);
			
			var buff:LegitBuffer = new LegitBuffer();
			buff.write("INPT");
			buff.writeUInt8(bitfield,4);
			return buff.byteArray;
		}
	}
}
