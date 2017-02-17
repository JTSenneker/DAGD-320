package  {
	import flash.geom.ColorTransform;
	import fl.motion.Color;
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	
	public class Card extends MovieClip {
	
		
		public var cardNumber:int;
		public var cardColor:int;
		public var select:Boolean = false;
		
		
		public function Card(number:int,color:int) {
			cardNumber = number;
			cardColor = color;
			cardNumberTxt.text = "" + cardNumber;
			switch(cardColor){
				case 1:
					cardFrame.transform.colorTransform = new ColorTransform(1,0,0,1,0,0,0,0);
					break;
				case 2:
					cardFrame.transform.colorTransform = new ColorTransform(0,1,0,1,0,0,0,0);
					break;
				case 3:
					cardFrame.transform.colorTransform = new ColorTransform(0,0,1,1,0,0,0,0);
					break;
				case 4:
					cardFrame.transform.colorTransform = new ColorTransform(0,1,1,1,0,0,0,0);
					break;
				
			}
			addEventListener(MouseEvent.MOUSE_OVER,function(e:MouseEvent):void{select = true;});
			addEventListener(MouseEvent.MOUSE_OUT,function(e:MouseEvent):void{select = false;});
		}
		
		public function dispose(){
			addEventListener(MouseEvent.MOUSE_OVER,function(e:MouseEvent):void{select = true;});
			addEventListener(MouseEvent.MOUSE_OUT,function(e:MouseEvent):void{select = false;});			
		}
		public function updateCardInfo():void{
			cardNumberTxt.text = "" + cardNumber;
			switch(cardColor){
				case 1:
					cardFrame.transform.colorTransform = new ColorTransform(1,0,0,1,0,0,0,0);
					break;
				case 2:
					cardFrame.transform.colorTransform = new ColorTransform(0,1,0,1,0,0,0,0);
					break;
				case 3:
					cardFrame.transform.colorTransform = new ColorTransform(0,0,1,1,0,0,0,0);
					break;
				case 4:
					cardFrame.transform.colorTransform = new ColorTransform(0,1,1,1,0,0,0,0);
					break;
				
			}
		}
	}
	
}
