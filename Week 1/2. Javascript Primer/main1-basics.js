//Declaring Variables

var name = "Slim Shady";
var num = 320;

//Javascript is not type-safe. It is an "untyped" language.
//variables do not have a data type and can switch types.

var likesPizza = true;
likesPizza = 42;

//Declaring Functions

function myFunc(){

}
//notice there is no datatype declared for returns or paramaters

function square(n){
	return n*n;
}

//here's an array literal:
var arr = [];

//here's another:
var arr = [1,2, "cow", true];

for(var i = 0; i < arr.length; i++){
	console.log(arr[i]);
}