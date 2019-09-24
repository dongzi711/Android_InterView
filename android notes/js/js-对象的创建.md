# 对象创建

## 工厂模式

```javascript
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
```

## 构造函数模式

