package  {
	import flash.utils.ByteArray;
	
	public class PacketFactory {

		static public function Join(username:String):ByteArray{
			var buff:LegitBuffer = new LegitBuffer();
			buff.write("JNRQ");
			buff.writeUInt8(username.length,4);
			buff.write(username,5);
			return buff.byteArray;
		}
		
		static public function Input():ByteArray{
			var bitfield:int = 0;
			
			if(Keyboard.isDown(Keyboard.W) || Keyboard.isDown(Keyboard.UP)) bitfield |= (1 << 0);
			if(Keyboard.isDown(Keyboard.A)|| Keyboard.isDown(Keyboard.LEFT)) bitfield |= (1 << 1);
			if(Keyboard.isDown(Keyboard.S)|| Keyboard.isDown(Keyboard.DOWN)) bitfield |= (1 << 2);
			if(Keyboard.isDown(Keyboard.D)|| Keyboard.isDown(Keyboard.RIGHT)) bitfield |= (1 << 3);
			if(Keyboard.isDown(Keyboard.SPACE))bitfield |= (1 << 4);
			
			var buff:LegitBuffer = new LegitBuffer();
			buff.write("INPT");
			buff.writeUInt8(bitfield,4);
			return buff.byteArray;
		}
	}
}
