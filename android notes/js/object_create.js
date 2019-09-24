/**
 * 工厂模式
 * 缺点是：全都是Object，无法区别对象
 */
function createPerson(name) {
    var o = new Object();
    o.name = name;
    o.getName=function () {
        console.log(this.name);
    }
    return o;
}

var person1= createPerson('Cry')
console.log(person1);

/**
 * 构造函数模式 new
 */
function Person(name) {
    this.name=name;
    this.getName=function () {
        console.log(this.name);
    }
}
var person2= new Person('Cry2')
console.log(person2);

/**
 * 构造函数优化方法
 */
function getName() {
    console.log(this.name);
    
}

function Person(name) {
    this.name=name;
    this.getName=getName
}

/**
 * 原型模式
 */
function Person() {
    
}
Person.prototype.name='kevin';
Person.prototype.getName=function () {
    console.log(this.name);
}

/**
 * 原型优化1
 */
function Person(name) {
    
}
Person.prototype={
    name:'kevin',
    getName:function () {
        console.log(this.name);
    }
}

/**
 * 原型优化2
 */
function Person(name) {

}

Person.prototype = {
    constructor: Person,
    name: 'kevin',
    getName: function () {
        console.log(this.name);
    }
};

/**
 * 组合模式
 */
function Person(name) {
    this.name = name;
}

Person.prototype = {
    constructor: Person,
    getName: function () {
        console.log(this.name);
    }
};

/**
 * 动态原型模式
 * 注意：使用动态原型模式时，不能用对象字面量重写原型！！！！
 * 
 * function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }
    }
}

var person1 = new Person('kevin');
var person2 = new Person('daisy');

// 报错 并没有该方法
person1.getName();

// 注释掉上面的代码，这句是可以执行的。
person2.getName();
 * 
 */
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype.getName = function () {
            console.log(this.name);
        }
    }
}


/**
 * 回顾一下new的过程
 * 1. 创建一个对象
 * 2. 对象的运行只向Person.prototype
 * 3. 然后调用Person.apply(obj)
 * 4. 返回这个对象
 * 
 * 意思就是在执行构造函数时。 obj.Person方法时，已经链接了Person.prototype
 * 之后再用字面量对象覆盖了Person.prototype.
 * 但是此时，对应的prototype已经不是一个东西了。指向原来的固然没有getName方法
 */

//如果需要用字面量形式。就得重新去创建一个对象。重新链接
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }

        return new Person(name);
    }
}

/**
 * 寄生函数模式
 */
function Person(name) {

    var o = new Object();
    o.name = name;
    o.getName = function () {
        console.log(this.name);
    };

    return o;

}


//特殊场景使用
//这样方法可以在特殊情况下使用。
//比如我们想创建一个具有额外方法的特殊数组，
//但是又不想直接修改Array构造函数，我们可以这样写：

function SpecialArray() {
    var values = new Array();

    for (var i = 0, len = arguments.length; i < len; i++) {
        values.push(arguments[i]);
    }

    values.toPipedString = function () {
        return this.join("|");
    };
    return values;
}

var colors = new SpecialArray('red', 'blue', 'green');
var colors2 = SpecialArray('red2', 'blue2', 'green2');


console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2


/**
 * 5.2 稳妥构造函数模式
 */
function person(name){
    var o = new Object();
    o.sayName = function(){
        console.log(name);
    };
    return o;
}

var person1 = person('kevin');

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy