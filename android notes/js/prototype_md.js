//创建一个对象
function Person() {
    
}
//使用prototype
Person.prototype.name = 'kevin';

var person1 = new Person();
var person2 = new Person();

person1.name = 'cry';
console.log(person1.name);//cry
console.log(person2.name);//kevin
console.log(Person.prototype);

/**
 * Person(构造方法) ->prototype-> Person.prototype
 */


console.log(person1.__proto__===Person.prototype);
console.log(person2.__proto__===Person.prototype);

/**
 * Person(构造方法) -> prototype -> Person.prototype
 *       ||                             ||
 *      person     -> __proto__ -> Person.prototype
 */

 console.log(Person===Person.prototype.constructor);//true

 /**
 * Person(构造方法) -> prototype -> Person.prototype
 *       ||        <- constructor<-       ||
 *      person     -> __proto__ -> Person.prototype
 */

 console.log(Object.getPrototypeOf(person1)===Person.prototype);
 
 console.log(Person.prototype.__proto__===Object.prototype);//true
 /**
 * Person(构造方法) -> prototype -> Person.prototype -> __proto__ ->Object.prototype
 *       ||        <- constructor<-       ||
 *      person     -> __proto__ -> Person.prototype
 */

console.log(person1.constructor===Person.prototype.constructor);
