let notification = () => {
    /**
     * 下面是回调版本的
     */
    function notifyMessage(message, options, callback) {
        if (Notification && Notification.permission === 'granted') {
            var notification = new Notification(message, options);
            callback(null, notification);
        } else if (Notification.requestPermission) {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
                if (status === 'granted') {
                    var notification = new Notification(message, options);
                    callback(null, notification);
                } else {
                    callback(new Error('user denied'));
                }
            });
        } else {
            callback(new Error('doesn\'t support Notification API'));
        }
    }
    // 运行实例
    // 第二个参数是传给 `Notification` 的option对象
    notifyMessage("Hi!", {}, function (error, notification) {
        if (error) {
            return console.error(error);
        }
        console.log(notification); // 通知对象
    });

    /**
     * 基于上述风格的notifyMessage进行改造
     */
    function notifyMessageAsPromise(message, options) {
        return new Promise((resolve, reject) => {
            notifyMessage(message, options, (error, notification) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(notification);
                }
            })
        });
    }

    /**
     * 进行调用
     */
    notifyMessageAsPromise()
        .then((value)=>{
            console.log(value);
        })
        .catch((error)=>{
            console.log(error);
        });

}
notification()