//Often times, functions create a new context, 
//which can lead to all kinds of problems when working with callbacks

//got an error with a callback? print out "this" to see what your context is.
class Thing{
	constructor(){
		console.log(this);
		function test1(){ console.log(this);}
		test1();

		var test2 = function(){console.log(this);};
		test2();

		var me = this;
		var test3 = function(){console.log(me);};
		test3();//solves problem by using scope

		const test4 = (function(me){return function(){console.log(me);};})(this);
		test4();//solves problem using a self-executing closure

		const test5 = ()=>{console.log(this);};//arrow functions do not create their own context.
	}
}

new Thing();