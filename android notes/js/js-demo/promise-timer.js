let promiseTimer=()=>{
    function timerPromisefy(delay) {
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve(delay);
                console.log('from timeout='+delay);
            }, delay);
        });
    }

    //记录当前时间
    var startDate = Date.now();
    // 并发执行
    // Promise.all([
    //     timerPromisefy(1),
    //     timerPromisefy(32),
    //     timerPromisefy(64),
    //     timerPromisefy(128)
    // ]).then(function (values) {
    //     console.log(Date.now() - startDate + 'ms');
    //     // 約128ms
    //     console.log(values);    // [1,32,64,128]
    // });

    //只要一个返回，就返回then后面的方法.但是race的方法其实还是会去执行。
    Promise.race([
        timerPromisefy(1),
        timerPromisefy(32),
        timerPromisefy(64),
        timerPromisefy(128)
    ]).then(function (values) {
        console.log(Date.now() - startDate + 'ms');
        // 約128ms
        console.log(values);    // 1
    });

    

};
promiseTimer();