package  {
	
	import flash.display.MovieClip;
	
	
	public class Bullet extends ReplicableGameObject {
		
		static public function get classID():String{return "BLLT";}
		
		static public function createInstance():Bullet{return new Bullet();}
		
		public override function replicate(buff:LegitBuffer):void{
			x=buff.readUInt16(10);
			y=buff.readUInt16(12);
		}
	}
	
}
