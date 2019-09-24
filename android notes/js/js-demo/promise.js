let promise_ = function () {
    return function () {
        /**
         * promise的使用
         */
        let promise = new Promise(function (resolve) {
            // resolve(45);
            setTimeout(() => {
                console.log(45);
            }, 1000);
        });

        promise.then(function (value) {
            console.log(value);

        }).catch(function (error) {
            console.error(error);
        })

        /**
         * 基本的结构
         */
        let promise2 = new Promise(function (resolve, reject) {
            //异步操作
            //处理结束后，调用resolve或者reject
        });
    }()
};

promise_();