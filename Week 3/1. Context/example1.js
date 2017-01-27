let cat = "meow";

function derp(){
	conosle.log(cat);
}

class DerpClass{
	constructor(){
		console.log(cat);
	}
}

derp();
new derp();
new DerpClass();
// all three of the above examples define their own scope but can access their "parent scope"