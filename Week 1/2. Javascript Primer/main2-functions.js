//in JS functions are "first-class citizens."
//This means they are a legit data type.

//Anonymous functions. These do not have a name.
//They are useful because you can reference them with a variable.
var myFunc = function() { console.log("Hello?"); };
myFunc();

//Since we can store functions in variables, we can pass them into
//other functions.

function callFunc(func){
	func();
}
callFunc(myFunc);

//You can also pass anonymous functions directly into other functions.

callFunc(function(){console.log("It's me.");});

//ECMAScript 6 (ES6) introduces lots of new features
//These include arrow functions.

var square = n => n*n;
console.log(square(12));

//Arrow functions can be written more verbosely:

var mult = (a, b) => {return a*b;};
console.log(mult(6,9));

//Here's a real scenario using anon functions

var arr = [1,2,3,4];
arr.map(function(item){console.log(item);});
arr.map(item=>{console.log(item);});