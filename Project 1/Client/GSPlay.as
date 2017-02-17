package  {
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.MouseEvent;

	public class GSPlay extends GameScene{
		static public var playerid:int = 0;
		private var state:GameState;
		
		const playerHand:Vector.<Card> = new Vector.<Card>([]);
		var topCard:Card = new Card(1,1);
		var cardNumber:int = 0;
		var cardColor:int = 0;
		
		public function GSPlay(state:GameState) {
			drawBttn.addEventListener(MouseEvent.CLICK,drawCard);
			if(playerid == 1 || playerid == 2){
				while (playerHand.length < 7){
					cardNumber = Math.floor(Math.random()*10);
					cardColor = Math.floor(Math.random()*4);
					var card:Card = new Card(cardNumber,cardColor);
					playerHand.push(card);
					addChild(card);
				}
				addListeners();
				
			}
			
			cardNumber = Math.floor(Math.random()*10);
			cardColor = Math.floor(Math.random()*4)+1;
			topCard = new Card(cardNumber, cardColor);
			addChild(topCard);
			topCard.x = cardSpace.x
			topCard.y = cardSpace.y
			
			for(var i:int =0; i < playerHand.length; i++){
				playerHand[i].x = i*(width/playerHand.length);
				playerHand[i].y = height-100;

				}
				updateState(state);
				updatePrompts();

			}
		private function drawCard(e:MouseEvent):void{
			if(playerid == state.playersTurn){
				var newCard:Card = new Card(Math.floor(Math.random()*10),Math.floor(Math.random()*4)+1);
				newCard.addEventListener(MouseEvent.CLICK,placeCard);
				playerHand.push(newCard);
				addChild(newCard);
				for(var i:int =0; i < playerHand.length; i++){
					playerHand[i].x = i*(width/playerHand.length);
					playerHand[i].y = height-100;
					}
				Game.socket.sendMove(topCard.cardNumber,topCard.cardColor,1);
				updatePrompts();
			}
		}
		private function placeCard(e:MouseEvent):void{
			if(playerid == state.playersTurn){
				for(var i = playerHand.length-1; i>=0; i--){
					var card:Card = playerHand[i]
					trace(playerHand[i].select);
					if(playerHand[i].select){
						trace(playerHand[i].cardNumber);
						
						if(playerHand[i].cardNumber == topCard.cardNumber || playerHand[i].cardColor == topCard.cardColor){
							topCard.cardNumber = playerHand[i].cardNumber;
							topCard.cardColor = playerHand[i].cardColor;
							topCard.updateCardInfo();
							removeChild(playerHand[i]);
							playerHand[i].dispose();
							playerHand[i].removeEventListener(MouseEvent.CLICK,placeCard);
							playerHand.splice(i,1);
							Game.socket.sendMove(topCard.cardNumber,topCard.cardColor,2);
							updatePrompts();
							
						}
					}
				}
			}
		}
		private function addListeners():void{
			for each(var card:Card in playerHand){
				card.addEventListener(MouseEvent.CLICK,placeCard);
			}
		}
		override public function dispose():void{
			for each(var card:Card in playerHand){
				card.removeEventListener(MouseEvent.CLICK,placeCard);
			}
		}
		override public function handlePacket(packet:PacketIn):void{
			switch(packet.type){
				case PacketType.UPDT:
					updateState(PacketInUpdt(packet).state);
					break;
			}
		}
		private function updateState(state:GameState){
			trace("you got a god damn update");
			this.state = state;
			topCard.cardColor = state.topCardColor;
			topCard.cardNumber = state.topCardNumber;
			topCard.updateCardInfo();
			updatePrompts();
		}
		private function updatePrompts(){
			if(state.playersTurn == playerid)prompt.text = "Okay. NOW you can go.";
			else prompt.text = "Hold your damn horses!";
			
			if(state.winner != 0){
				if(playerid == 3){
					prompt.text = "Player " +state.winner+" wins!";
				}else{
					if(state.winner == playerid)prompt.text = "Congratulations. You're a REAL pro.";
					else prompt.text = "Sucks to suck.";
				}
			}
			handCounts.text = "Player 1 has " +state.player1HandCount+" cards left.\n"+"Player 2 has " +state.player2HandCount+" cards left.";
		}
	}
	
}
