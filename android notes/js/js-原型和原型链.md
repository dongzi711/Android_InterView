# 原型和原型链

## `prototype`

每个函数都有个prototype属性，就是我们经常看到的。

```javascript

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

```

这个属性到底是指向哪儿呢？
其实`prototype`属性指向了一个对象。这个对象正是调用该构造方法而创建的**实例**的原型。
可以这样理解：每个Javascript对象(null除外)在创建的时候就会与之关联另外一个对象。这个对象就是我们说的原型。

![https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype1.png](图示：和原型的关系)

## `__proto__`

每个Javascript对象(除了null)都具有的属性，叫做`__proto_`,该对象会指向对象的原型。

```javascript
console.log(person1.__proto__===Person.prototype);//true
console.log(person2.__proto__===Person.prototype);//true
```

![https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype2.png](proto连接)

## `constructor`

每个原型都有一个 constructor 属性指向关联的构造函数

```javascript
/**
 * Person(构造方法) -> prototype -> Person.prototype
 *       ||        <- constructor<-       ||
 *      person     -> __proto__ -> Person.prototype
 */

```

## 原型的原型

```javascript
 console.log(Person.prototype.__proto__===Object.prototype);//true

```

## 原型链

关系示意图如下

```javascript
 /**
 * Person(构造方法) -> prototype -> Person.prototype -> __proto__ ->Object.prototype ->__proto__->null
 *       ||        <- constructor<-       ||
 *      person     -> __proto__ -> Person.prototype
 */

```

## 补充

### `constructor`

当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性，所以：

```javascript
console.log(person1.constructor===Person.prototype.constructor);
//true
```

### `__proto__`

其次是 `__proto__` ，绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 `Object.prototype` ，与其说是一个属性，不如说是一个 `getter/setter`，当使用 `obj.__proto__`时，可以理解成返回了 `Object.getPrototypeOf(obj)`。

### `继承与委托`

>继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

## 最后
https://github.com/mqyqingfeng/Blog/issues/2