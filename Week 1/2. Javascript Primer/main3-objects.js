//Javascript is a functional language more than an object oriented language.
//However, you can still create objects in JS.

//Here is an empty object

var obj = {};

//we can easly add properties and methods to the object dynamically.

obj.x = 150;
obj.printX = function(){console.log(this.x);};

obj.printX();

//Here is anothe robject literal in JSON
//JSON stands for Javascript Object Notation

obj = {
	x: 150,
	y: 32,
	isDead: false,
	killMe: function(){
		this.isDead = true;
	},
};

obj.killMe();
console.log(obj.isDead);

//Javascript doesn't have classes (until ES6)
//Javascript uses functions to template objects

function Person(name, age){
	this.name = name;
	this.age = age;
	this.isAlive = true;
	this.execute = function(){
		this.isAlive = false;
	};
	this.getOlder = function(years){
		this.age += years;
	}
}

var nick = new Person("Nick", 31);
nick.getOlder(-5);
console.log(nick.age);

//ES6 introduced classes! So many things are now easier.
class Sprite{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.rotation = 45;
	}
}

class Enemy extends Sprite{
	constructor(){
		super();
	}
	spin(amount){
		this.rotation += amount;
	}
}

var enemy = new Enemy();
enemy.spin(20);
console.log(enemy.rotation);