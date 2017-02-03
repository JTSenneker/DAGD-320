package {

	import flash.display.MovieClip;
	import flash.events.MouseEvent;


	public class GSPlay extends GameScene {

		public var playerOnesTurn: Boolean = true;

		public function GSPlay() {
			cell1.addEventListener(MouseEvent.CLICK, handleClick);
			cell2.addEventListener(MouseEvent.CLICK, handleClick);
			cell3.addEventListener(MouseEvent.CLICK, handleClick);
			cell4.addEventListener(MouseEvent.CLICK, handleClick);
			cell5.addEventListener(MouseEvent.CLICK, handleClick);
			cell6.addEventListener(MouseEvent.CLICK, handleClick);
			cell7.addEventListener(MouseEvent.CLICK, handleClick);
			cell8.addEventListener(MouseEvent.CLICK, handleClick);
			cell9.addEventListener(MouseEvent.CLICK, handleClick);
		}
		private function checkForWinner(): void {
			if (cell1.currentFrame == cell2.currentFrame && cell2.currentFrame == cell3.currentFrame) { // row 1
				if (cell1.currentFrame == 2) declareWinner(true);
				if (cell1.currentFrame == 3) declareWinner(false);
			}
			if (cell4.currentFrame == cell5.currentFrame && cell5.currentFrame == cell6.currentFrame) { // row 2
				if (cell4.currentFrame == 2) declareWinner(true);
				if (cell4.currentFrame == 3) declareWinner(false);
			}
			if (cell7.currentFrame == cell8.currentFrame && cell8.currentFrame == cell9.currentFrame) { // row 3
				if (cell7.currentFrame == 2) declareWinner(true);
				if (cell7.currentFrame == 3) declareWinner(false);
			}

			if (cell1.currentFrame == cell4.currentFrame && cell4.currentFrame == cell7.currentFrame) { // column 1
				if (cell1.currentFrame == 2) declareWinner(true);
				if (cell1.currentFrame == 3) declareWinner(false);
			}
			if (cell2.currentFrame == cell5.currentFrame && cell5.currentFrame == cell8.currentFrame) { // column 2
				if (cell2.currentFrame == 2) declareWinner(true);
				if (cell2.currentFrame == 3) declareWinner(false);
			}
			if (cell3.currentFrame == cell6.currentFrame && cell6.currentFrame == cell9.currentFrame) { // column 3
				if (cell3.currentFrame == 2) declareWinner(true);
				if (cell3.currentFrame == 3) declareWinner(false);
			}

			if (cell1.currentFrame == cell5.currentFrame && cell5.currentFrame == cell9.currentFrame) { // diagonal 1
				if (cell1.currentFrame == 2) declareWinner(true);
				if (cell1.currentFrame == 3) declareWinner(false);
			}
			if (cell3.currentFrame == cell5.currentFrame && cell5.currentFrame == cell7.currentFrame) { // diagonal 2
				if (cell3.currentFrame == 2) declareWinner(true);
				if (cell3.currentFrame == 3) declareWinner(false);
			}

		}
		private function declareWinner(wasItPlayerOne: Boolean): void {

		}
		private function handleClick(e: MouseEvent): void {

			if (e.target.currentFrame == 1) {
				if (playerOnesTurn) {
					e.target.gotoAndStop(2);
					playerOnesTurn = false;
				} else {
					e.target.gotoAndStop(3);
					playerOnesTurn = true;
				}
				checkForWinner();
			}
		}
	}
}