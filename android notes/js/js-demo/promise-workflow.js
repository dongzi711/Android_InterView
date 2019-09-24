let promise_workflow = function () {
    /**
     * promise-workflow
     */

    /*
    1
     */
    function asyncFunction() {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve('Async Hello world');
            }, 1000);
        })
    }

    /*
    2
    */
    asyncFunction().then(function (value) {
        console.log(value);
    }).catch(function (error) {
        console.log(error);
    });

    /**
     * 创建XMR的promise对象
     */

    /*
    1.创建promise包裹
    */
    function getURL(URL) {
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();
            req.open('GET', URL, true);
            req.onload = () => {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(new Error(req.statusText));
                }
            }
            req.onerror = () => {
                reject(new Error(req.statusText));
            }
            req.send();
        })
    }

    /*
      运行实例
     */
    let URL = 'http://httpbin.org/get';
    getURL(URL).then((value) => {
        console.log(value);
    }).catch((value)=>{
        console.error(value);
    });
    
}
promise_workflow();