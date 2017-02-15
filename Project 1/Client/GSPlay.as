package  {
	import flash.display.MovieClip;
	import flash.display.Sprite;
	public class GSPlay extends GameScene{

		var playerHand:Array = [];
		var topCard:Card = new Card(1,1);
		var cardNumber:int = 0;
		var cardColor:int = 0;
		public function GSPlay() {
			
			while (playerHand.length < 7){
				
				cardNumber = Math.floor(Math.random()*10);
				cardColor = Math.floor(Math.random()*4);
				var card:Card = new Card(cardNumber,cardColor);
				playerHand.push(card);
				addChild(card);
			}
			cardNumber = Math.floor(Math.random()*10);
			cardColor = Math.floor(Math.random()*4);
			topCard = new Card(cardNumber, cardColor);
			for(var i:int =0; i < playerHand.length; i++){
				trace(stage.width/i);
				playerHand[i].x = width/i;
			}
		}

	}
	
}
