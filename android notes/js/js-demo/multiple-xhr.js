let mulXhr = () => {
    function getURL(URL) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', URL, true);
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(new Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(new Error(req.statusText));
            };
            req.send();
            console.log("send URL=" + URL);
        });
    }

    let request = {
        comment: () => {
            return getURL('http://azu.github.io/promises-book/json/comment.json').then(JSON.parse);
        },
        people: () => {
            return getURL("http://azu.github.io/promises-book/json/people.json").then(JSON.parse);
        }
    }

    let main = () => {
    
        // function recordValue(results, value) {
        //     results.push(value);
        //     return results;
        // }
        // var pushValue = recordValue.bind(null, []);
        //这里传入then中的方法，不需要调用。
        // return request.comment().then(pushValue).then(request.people).then(pushValue);
    
        // 换成promise.all。同时开始、并行执行
        return Promise.all([request.comment(),request.people()])

    }

    main().then((value) => {
        console.log(value);
    }).catch((value) => {
        console.error(value);
    });

};
mulXhr();