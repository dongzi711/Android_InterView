# javascript内的this
### 什么是this?为什么要用this?
`this`是JS中的一个机制，也是关键词。它被定义在所有函数的作用域中。

#### 误解1：this指向函数本身
```javascript
function fn() {
  this.count++;
}
fn.count = 0;
fn();
fn();
console.log(fn.count);// 0
```

事实上，函数`fn`内部的this指向的是全局对象`window`或者是`global`(Node.js中)。
并没有指向函数`fh`本身。
为什么`this`指向全局对象去了？
因为在非严格模式下，全局作用域中的函数被独立调用时，它的`this`默认指向(绑定)`window`或者`gobal`;
在严格模式下，`this`为`undefined`

> 注意：在全局对象中。浏览器运行环境就是window


### 解开`this`机制
原则：
- this不指向函数本身，也不止像函数的作用域
- this是在函数被调用时发生的绑定，它的(绑定)指向完全取决于函数在哪里被调用，并不是在编写时绑定的

#### 函数被调用时，this的绑定原则
- 默认绑定
  当函数被独立调用时，也就是直接`function()`,没有`new`、`call`、`apply`,作为对象的方法区调用时，
  函数里的this会被默认绑定到全局对象(非严格模式)，也就是上文中的情况。

```javascript
function fn() {
  this.count++; //this指向window
}
fn.count = 0;
fn(); //实际调用的是window.fn()
fn();
console.log(fn.count);// 0
```

- 隐身绑定
  当函数被某个对象拥有时，而且是作为obj对象的方法区调用时，函数里面的this就是obj对象。

```javascript
function fn () {
  console.log(this.a);
}
var obj = {
  a: 1,
  fn: fn
}
obj.fn();// 1

// 或者
var obj = {
  a: 1,
  fn: function() {
    console.log(this.a);
  }
}
obj.fn();// 1

```

一个特殊的例子
```javascript
function cb(fn) {
  //对这个方法调用的，就不再算是对象了
  fn&&fn();// 看，调用位置在这！
}
function fn () {
  console.log(this.a);
}
var a = 2;// window的
var obj = {
  a: 1,
  fn: fn
};

//将对象的方法传递给了这个方法
cb(obj.fn);// 2
```
原则还是在调用的位置。如果调用该方法的是对象，则`this`指向对象。如果不是，则是默认绑定的`window`。


- 显示绑定
  `js`提供了`call`和`apply`以及`ES`提供的`bind`方法来绑定`this`
```javascript

/*
同样上面的例子，先看bind方法
*/
function cb(fn) {
  fn&&fn();// 看，调用位置在这！
}
function fn () {
  console.log(this.a);
}
var a = 2;// window的
var obj = {
  a: 1,
  fn: fn
};
//直接调用bind方法。绑定调用为obj。实际上应该是调用了apply方法？
cb(obj.fn.bind(obj));// 1

//call方法
fn.call(obj);
fn.apply(obj);

//其实两者传递的参数不大一样

function fn3(b,c,d) {
  console.log(this.a,b,c,d);
}

fn3.call(obj,2,3,4);//参数一个一个传
fn3.apply(obj,[2,3,4])//传递的是一个数组
```

- bind的简单模拟
```javascript
if(!Function.prototype.bind){
  Function.prototype.bind=function(context){
    var self = this,
    args= Array.prototype.slice.call(arguments,1);
    return function(){
      self.apply(context,args.concat(Array.prototype.slice.call(arguments)));
    }
  }
}
```

- new绑定
  如果使用new来调用函数的，会执行下面操作
  1. 创建一个新的对象
  2. 这个对象会执行[Prototype]连接
  3. 这个对象会执行(绑定)到函数调用的this
  4. 这个函数没有返回其他对象，那么new函数调用会返回这个新的对象

```javascript
function fn(a){
  this.a = a;
}
var obj = new fn(1);
obj.a//1

//以上代码可以这么理解
var obj = {}
obj.__proto_=fn.prototype;//关系原型链
fn.call(obj);//绑定this;
```

#### 箭头函数内的`this`
>箭头函数里this，不采用上面的4种原则，而是根据外层（函数或者全局）作用域来决定this，它会继承外层函数调用的this绑定

```javascript
var a = 123;
var obj = {
  a: 1,
  fn: function() {
    // 若obj.fn(), 这个作用域this指向obj; 
    return function() {
      // 这种情况下，这个闭包里的this是无法访问外部作用域的this
      console.log(this.a);// this指向全局
    }
  }
}
obj.fn()();// 123

// ES5
var obj = {
  a: 1,
  fn: function() {
    // 用self保存当前this的引用；
    var self = this;
    return function() {
      console.log(self.a);// 1
    }
  }
}
obj.fn()();// 1

// 使用箭头函数
var obj = {
  a: 1,
  fn: function() {
    return () => {
      // 箭头继承了外层函数的this的绑定
      console.log(this.a);
    }
  }
}
obj.fn()();// 1

```
在`setTimeout`函数中，同样可以这样使用
```javascript
function Fn(a) {
  this.a = a;
  setTimeout(() => {
    console.log(this.a);
  },0)
};
new Fn(1);// 1
```

