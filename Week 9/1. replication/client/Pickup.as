package  {
	
	import flash.display.MovieClip;
	
	
	public class Pickup extends ReplicableGameObject {
		
		
		static public function get classID():String{return "PKUP";}
		
		static public function createInstance():Pickup{return new Pickup();}
		
		public override function replicate(buff:LegitBuffer):void{
			x=buff.readUInt16(10);
			y=buff.readUInt16(12);
			trace(buff.readUInt16(10));
		}
	}
	
}