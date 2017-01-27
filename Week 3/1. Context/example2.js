function derp(){
	console.log(this);
}

class DerpClass{
	constructor(){
		console.log(this);
	}
}

//context is like the concept of scope, but for the "this" keyword.
//two of the following examples create their own context.
new derp();
new DerpClass();
derp();//no new context when simply calling a function.