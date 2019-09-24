var demo = function () {
    return function () {
        // window.alert('Hello World');

        /*
        柯里化
        柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
        */

        //第一版curry
        var curry = function (fn) {
            //去掉第一个参数。因为第一个参数是方法？！
            var args = [].slice.call(arguments, 1);
            console.log(args);
            return function () {
                //重新加上第二次传入的参数，传递给原来的方法，进行调用
                var newArgs = args.concat([].slice.call(arguments))
                console.log(newArgs);
                return fn.apply(this, newArgs);
            };
        }

        /*
        第二版
        第一版虽然已经有感觉了。但是不是我们最后想要的。
        再进行第二版
        */
        function sub_curry(fn) {
            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 1);
            return function () {
                return fn.apply(this, args.concat(slice.call(arguments)));
            }
        }

        function curry_v2(fn, length) {
            //如果不传递这个长度，则用fn的方法长度。
            length = length || fn.length;

            var slice = Array.prototype.slice;

            return function () {
                //如果当前方法的长度，小于目标长度，则说明需要curry
                if (arguments.length < length) {
                    console.log('combined');
                    var combined = [fn].concat(slice.call(arguments));
                    var newLength = length - arguments.length;
                    var ret = curry.apply(this, combined)
                    // console.log('newLength='+newLength);
                    // console.log('ret='+ret);
                    return curry_v2(ret, newLength);
                } else {
                    console.log('direct');
                    // console.log(this);
                    //如果不是，则不需要
                    return fn.apply(this, arguments);
                }
            }
        }


        /*
        第三版。
        不按照顺序传参
        */
        function curry_v3(fn, args, holes) {
            var length = fn.length;
            args = args || [];
            holes = holes || []

            return function () {
                //取得全部的args
                var _args = args.slice(0)
                var _holes = holes.slice(0)

                var argslen = args.length;
                var holeslen = holes.length;
                var arg, i, index = 0;

                for (i = 0; i < arguments.length; i++) {
                    arg = arguments[i];
                    // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
                    if (arg === _ && holeslen) {
                        index++;
                        if (index > holeslen) {
                            _args.push(arg);
                            _holes.push(argslen - 1 + index - holeslen);
                        }
                    }
                    // 处理类似 fn(1)(_) 这种情况
                    else if (arg === _) {
                        _args.push(arg);
                        _holes.push(argsLen + i);

                    }
                    // 处理类似 fn(_, 2)(1) 这种情况
                    else if (holeslen) {
                        // fn(_, 2)(_, 3)
                        if (index >= holesLen) {
                            _args.push(arg);
                        }
                        // fn(_, 2)(1) 用参数 1 替换占位符
                        else {
                            _args.splice(_holes[index], 1, arg);
                            _holes.splice(index, 1)
                        }
                    } else {
                        _args.push(arg);
                    }
                }

                if (_holes.length || _args.length < length) {
                    return curry.call(this, fn, _args, _holes);
                } else {
                    return fn.apply(this, _args);
                }
            }
        }

        /*
        高颜值写法
        */

        var curry_high = fn =>
            judge = (...args) =>
                args.length == fn.length
                    ? fn(...args)
                    : (arg) => judge(...args, arg)

        // example 1
        function add(a, b) {
            return a + b;
        }

        var addCurry = curry_v2(add);
        // console.log(addCurry(1, 2));

        var fn = curry_v2(function (a, b, c) {
            return [a, b, c];
        })

        // console.log(fn("a","b","c"));
        // console.log(fn("a")("b")('C'));
        // console.log(fn("a")("b", "c"));

        var _ = {};

        // var fn = curry_v3(function (a, b, c, d, e) {
        //     console.log([a, b, c, d, e]);
        // });
        // fn(1, 2, 3, 4, 5);
        // fn(_, 2, 3, 4, 5)(1);
        // fn(1, _, 3, 4, 5)(2);
        // fn(1, _, 3)(_, 4)(2)(5);
        // fn(1, _, _, 4)(_, 3)(2)(5);
        // fn(_, 2)(_, _, 4)(1)(3)(5)

        // console.log(curry_high(function (a, b, c) {
        //     return [a, b, c];
        // })("a")("b")('C'));


        //example 2 
        // function ajax(type, url, data) {
        //     var xhr = new XMLHttpRequest();
        //     xhr.open(type, url, true);
        //     xhr.send(data);
        // }

        // const url = 'https://api.github.com/';

        // //这样就可以直接调用
        // ajax('GET', url, '')

        // //利用curry
        // var ajaxCurry = curry(ajax);
        // var get = ajaxCurry('GET');
        // get(url)


    }
}();
demo()
