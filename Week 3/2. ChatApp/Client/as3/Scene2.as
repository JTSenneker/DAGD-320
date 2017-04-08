package as3 {		import flash.display.MovieClip;	import flash.events.*;	import com.adobe.tvsdk.mediacore.TextFormat;
		public class Scene2 extends Scene {				var buffer:String = "";
		var charSplit:String ="\n";
		var username:String = "";		public function Scene2() {			textChat.addEventListener(KeyboardEvent.KEY_DOWN, handleKeyChat);			bttnChat.addEventListener(MouseEvent.CLICK, handleClickChat);
			ChatApp.socket.addEventListener(DataEvent.DATA,handleData);		}		
		function handleData(e:DataEvent):void{
			buffer = e.data;
			var parts = buffer.split("\t");
			//buffer = parts.pop();
			trace(parts[0]);
			switch(parts[0]){
				case "ANNOUNCE":
					textMain.htmlText += "<b><i>";
					for(var i = 1;i<parts.length;i++){
						textMain.htmlText += parts[i] + "\n";
					}
					textMain.htmlText += "</i></b>\n";
					break;
				case "CHAT":
					for(var i = 1;i<parts.length;i++){
						textMain.htmlText += parts[i] + "\n";
					}
					textMain.htmlText += "\n";
					break;
				case "PMSG":
					textMain.htmlText += "PM from " + parts[2] + ":\n";
					for(var i = 3;i<parts.length;i++){
						textMain.htmlText += parts[i];
					}
					textMain.htmlText += "\n";
					break;
			}
		}		function handleKeyChat(e:KeyboardEvent):void {			if(e.keyCode == 13) sendMsg();		}		function handleClickChat(e:MouseEvent):void {			sendMsg();		}		function sendMsg():void {
			if(textChat.text.charAt(0) == "@"){
				textChat.text.slice(textChat.text.indexOf("@"));
				ChatApp.socket.writeUTFBytes("PMSG\t"+textChat.text+"\n");
			}
			else{				ChatApp.socket.writeUTFBytes("CHAT\t"+textChat.text + "\n");
			}
			ChatApp.socket.flush();			//TODO: finish this
			
			textChat.text = "";		}		public override function dispose():void {			textChat.removeEventListener(KeyboardEvent.KEY_DOWN, handleKeyChat);			bttnChat.removeEventListener(MouseEvent.CLICK, handleClickChat);
			ChatApp.socket.removeEventListener(DataEvent.DATA,handleData);		}	}}