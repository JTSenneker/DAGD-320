﻿package as3 {
		private var scene:Scene;
		
			if(scene == null) return;
			removeChild(scene);
			clearScreen();
			scene = new Scene1();
			scene = new Scene2();