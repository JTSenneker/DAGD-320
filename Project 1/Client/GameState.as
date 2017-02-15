package  {
	
	public class GameState {
		public var playersTurn:int = 0;
		public var winner:int = 0;
		public var player1HandCount:int = 0;
		public var player2HandCount:int = 0;
		public var topCardNumber
		public function GameState(stream:LegitBuffer) {
			
			playersTurn = stream.readUInt8(4);
			winner = stream.readUInt8(5);
			player1HandCount = stream.readUInt8(6);
			player2HandCount = stream.readUInt8(7);
			topCardNumber = stream.readUInt8(8);
			topCardColor = stream.readUInt8(9);
		}

	}
	
}
