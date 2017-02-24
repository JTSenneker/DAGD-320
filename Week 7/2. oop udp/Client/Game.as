package  {
	
	import flash.display.MovieClip;
	import flash.net.DatagramSocket;
	
	
	public class Game extends MovieClip {
		
		var sock:DatagramSocket = new DatagramSocket();
		
		public function Game() {
			var buff:LegitBuffer = new LegitBuffer();
			buff.write("Hello World");
			sock.send(buff.byteArray,0,buff.byteArray.length,"127.0.0.1",1234);
		}
	}
	
}
