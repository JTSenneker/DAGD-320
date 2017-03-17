package  {
	import flash.utils.Dictionary;
	
	public class ObjectCreationRegistry {

		
		static private var creationMap:Dictionary = new Dictionary();
		
		static public function create(classId:String):ReplicableGameObject {
			return creationMap.hasOwnProperty(classId) ? creationMap[classId]() : null;
		}
		static public function registerClasses():void {
			creationMap[Tank.classId] = Tank.createInstance;
		}
	}
}
