package  {
	import flash.utils.ByteArray;
	public class Protocol {

			static public function packetJoin():ByteArray{
				var buff:LegitBuffer = new LegitBuffer();
				buff.write("JREQ");
				return buff.byteArray;
			}
			static public function packetDisconnect():ByteArray{
				var buff:LegitBuffer = new LegitBuffer();
				buff.write("DISC");
				return buff.byteArray;
			}
			static public function packetInput(mx:Number,my:Number,md:Boolean):ByteArray{
				var buff:LegitBuffer = new LegitBuffer();
				buff.write("INPT");
				buff.writeUInt16(int(mx),4);
				buff.writeUInt16(int(my),6);
				buff.writeUInt8(md?1:0,8);
				return buff.byteArray;
			}

	}
	
}
