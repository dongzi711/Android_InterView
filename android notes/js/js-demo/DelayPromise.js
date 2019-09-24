let dp = () => {

    let delayPromise = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // setTimeout(() => {
    //     alert("已经过了100ms!!")
    // }, 100);

    // delayPromise(100).then(()=>{
    //     alert("已经过了100ms!!")
    // });

    let timeoutPromise = (promise, ms) => {
        return Promise.race([promise, delayPromise(ms).then(() => {
            throw new Error('Operation timed out after ' + ms + ' ms');
        })]);
    }

    // 运行示例
    var taskPromise = new Promise(function (resolve) {
        // 随便一些什么处理
        var delay = Math.random() * 2000;
        setTimeout(function () {
            resolve(delay + "ms");
        }, delay);
    });

    // timeoutPromise(taskPromise, 1000).then(function (value) {
    //     console.log("taskPromise在规定时间内结束 : " + value);
    // }).catch(function (error) {
    //     console.log("发生超时", error);
    // });

    /**
     * 定义Error对象
     */
    function  copyOwnFrom(target, source){
        Object.getOwnPropertyNames(source)
            .forEach(function(propName){
                Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName))
            });

        return target;
    }

    function TimeoutError (){
        let superInstance = Error.apply(null, arguments);
        copyOwnFrom(this, superInstance);
    }

    //继承
    TimeoutError.prototype=Object.create(Error.prototype);
    TimeoutError.prototype.constructor=TimeoutError;

    let promise = new Promise(()=>{
        throw new TimeoutError("timeout");
    });

    promise.catch((error)=>{
        console.log(error instanceof TimeoutError);
        
        console.log(typeof (error));
        
    });

    promise.then().catch();
};
dp();