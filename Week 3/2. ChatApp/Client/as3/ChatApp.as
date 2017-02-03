﻿package as3 {
		
		private var scene:Scene;
		
			main = this;
			socket.addEventListener(DataEvent.DATA,handleMessage);
			var msg: String = e.data;
			var parts:Array = msg.split("\t");
			
			switch(parts[0]){
				case"NAMEBAD":
					showScene3();
					break;
				case "NAMEOK":
					showScene2();
					break;
				default:
					if(scene != null){
						scene.handleMessage(e.data);
					}
					break;
			}
		}
			if(scene == null) return;
			removeChild(scene);
			clearScreen();
			scene = new Scene1();
			scene = new Scene2();
		public function showScene3(){
			clearScreen();
			scene = new Scene3();
			addChild(scene);
		}