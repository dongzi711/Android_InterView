let promise_p = () => {
    /**
     * 创建方式
     */
    // 1
    let promise1 = new Promise((resolve,reject)=>{});
    /** 
     * 2 
     * 等同于下面代码
     * new Promise(function (resolve){
     *  resolve(42);
     * });
     * 
     * 等同于
     * new Promise((resolve)=>{resolve(42);});
     */
    let promise2 = Promise.resolve(42);

    promise2.then((value) => {
        console.log(value);
    });

    /**
     * Thenable
     * resolve的方法就是讲thenable的对象转为promise
     */

      /**
        实际上then是异步的.
        可以看到 resolve中的代码是最后执行的
     */
    let promise3 = new Promise((resolve,reject)=>{
        console.log("inner 33333");
        resolve(3333);
    })
    promise3.then((value)=>{
        console.log(value);
    });
    console.log("outer 33333");

    
    
}
promise_p();