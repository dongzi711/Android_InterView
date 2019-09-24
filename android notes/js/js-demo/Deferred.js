let mDeferred = () => {

    /** 
     * 基于Promise实现Deferred的粒子
     */
    function Deferred() {
        //有个疑问。这个this是啥？
        console.log(this);
        this.promise = new Promise(
            function (resolve, reject) {
                this._resolve = resolve;
                this._reject = reject;
            }.bind(this)
        );
    }

    Deferred.prototype.resolve = function (value) {
        this._resolve.call(this.promise, value);
    }

    Deferred.prototype.reject = function (value) {
        this._reject.call(this.promise, value);
    }

    //改写请求
    function getURL(URL) {
        //因为这里当做对象来使用了。所以上面那个this，就是表示对象本身
        let deferred = new Deferred();
        let req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                deferred.resolve(req.responseText);
            } else {
                deferred.reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            deferred.reject(new Error(req.statusText));
        };
        req.send();
        return deferred.promise;
    }


    var URL = "http://httpbin.org/get";
    getURL(URL)
    .then(function onFulfilled(value) {
        console.log(value);
    })
    .catch(console.error.bind(console));
};
mDeferred();