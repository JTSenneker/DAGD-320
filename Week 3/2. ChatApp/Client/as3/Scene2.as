﻿package as3 {
	
		var charSplit:String ="\n";
			ChatApp.socket.addEventListener(DataEvent.DATA,handleData);
		function handleData(e:DataEvent):void{
			buffer = e.data;
			var parts = buffer.split("\t");
			//buffer = parts.pop();
			switch(parts[0]){
				case "CHAT":
					for(var i = 1;i<parts.length;i++){
						textMain.text += parts[i] + "\n";
					}
					textMain.text += "\n";
					break;
				case "PM":
					textMain.text += "PM from " + parts[i] + ":\n";
					for(var i = 2;i<parts.length;i++){
						textMain.text += parts[i];
					}
					break;
			}
		}
			if(textChat.text.charAt(0) == "@"){
				textChat.text.slice(textChat.text.indexOf("@"));
				ChatApp.socket.writeUTFBytes("PM\t"+textChat.text+"\n");
			}
			else{
			}
			ChatApp.socket.flush();
			
			textChat.text = "";
			ChatApp.socket.removeEventListener(DataEvent.DATA,handleData);