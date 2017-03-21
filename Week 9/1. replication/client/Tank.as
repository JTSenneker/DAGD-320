package  {
	
	import flash.display.MovieClip;
	
	
	public class Tank extends ReplicableGameObject {
		static public function get classId():String{return "TANK";}
		
		static public function createInstance():Tank{ return new Tank(); }
		
		public override function replicate(buff:LegitBuffer):void{
			x = buff.readUInt16(10);
			y = buff.readUInt16(12);
		}
	}
	
}
