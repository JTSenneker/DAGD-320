package  {
	
	import flash.display.MovieClip;
	
	
	public class Enemy extends ReplicableGameObject {
		
		static public function get classId():String{return "ENMY";}
		
		static public function createInstance():Enemy{ return new Enemy(); }
		
		public override function replicate(buff:LegitBuffer):void{
			x = buff.readUInt16(10);
			y = buff.readUInt16(12);
		}
	}
	
}
